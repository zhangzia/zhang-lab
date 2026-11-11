function export_surface_for_website(ax, outputFile)
%EXPORT_SURFACE_FOR_WEBSITE Export one rectangular surf/mesh to the web viewer.
%   export_surface_for_website(ax, "my-surface.json")
%   The JSON can be loaded locally in matlab-3d.html. Plot formatting and
%   MATLAB callbacks are not exported. Intended for MATLAB R2025a or later.
%   This helper has not been executed in the prototype's MATLAB session.

if nargin ~= 2 || ~isscalar(ax) || ~isgraphics(ax, 'axes')
    error('WebsiteExport:Axes', 'Pass an explicit Cartesian axes handle and an output filename.');
end
surfaces = findobj(ax, 'Type', 'Surface');
if numel(surfaces) ~= 1
    error('WebsiteExport:SurfaceCount', 'The viewer supports exactly one surface per JSON file.');
end
s = surfaces(1);
z = double(s.ZData);
x = double(s.XData);
y = double(s.YData);
if ~ismatrix(z) || ~isreal(z) || min(size(z)) < 2 || any(isinf(z), 'all')
    error('WebsiteExport:ZData', 'ZData must be a real matrix, at least 2-by-2, without Inf. NaN gaps are allowed.');
end
if ~isvector(x)
    if ~isequal(size(x), size(z)) || any(abs(x - x(1,:)) > 1e-10, 'all')
        error('WebsiteExport:XData', 'XData must be a vector or a rectangular meshgrid coordinate matrix.');
    end
    x = x(1,:);
end
if ~isvector(y)
    if ~isequal(size(y), size(z)) || any(abs(y - y(:,1)) > 1e-10, 'all')
        error('WebsiteExport:YData', 'YData must be a vector or a rectangular meshgrid coordinate matrix.');
    end
    y = y(:,1);
end
if numel(x) ~= size(z,2) || numel(y) ~= size(z,1) || ...
        ~isreal(x) || ~isreal(y) || any(isinf(x) | isnan(x)) || any(isinf(y) | isnan(y)) || ...
        numel(x) > 500 || numel(y) > 500
    error('WebsiteExport:GridSize', 'Use finite x/y vectors matching ZData, at most 500 points per axis.');
end
payload = struct('title', strjoin(string(ax.Title.String), ' '), ...
    'x', x(:).', 'y', y(:).', 'z', z, ...
    'xLabel', strjoin(string(ax.XLabel.String), ' '), ...
    'yLabel', strjoin(string(ax.YLabel.String), ' '), ...
    'zLabel', strjoin(string(ax.ZLabel.String), ' '));
fid = fopen(outputFile, 'w');
if fid < 0
    error('WebsiteExport:Write', 'Cannot open the requested output file.');
end
cleanup = onCleanup(@() fclose(fid)); %#ok<NASGU>
fwrite(fid, unicode2native(jsonencode(payload), 'UTF-8'), 'uint8');
fprintf('Saved surface data to %s\n', string(outputFile));
end

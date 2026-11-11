/* Annual Lazard LCOE report observations, 2009–2026.
 * Values verified in original report charts and assumption tables.
 * Each source page is retained; no interpolation or carry-forward.
 * Earlier PDFs are preserved by regulatory, academic and archival mirrors.
 */
(function(root){
  'use strict';
  const reports = [
  {
    "year": 2009,
    "version": 3,
    "url": "https://web.archive.org/web/20111125085510id_/http://efile.mpsc.state.mi.us:80/efile/docs/15996/0145.pdf",
    "page": 2,
    "pdfPage": 3,
    "scope": "U.S.-focused scenarios in 2008 dollars. June 2009 revision; renewable values use the No Tax Incentives sensitivity.",
    "values": {
      "wind": [
        101,
        169
      ],
      "solar": [
        323,
        394
      ],
      "gas": [
        69,
        96
      ],
      "coal": [
        78,
        144
      ],
      "peaker": [
        216,
        334
      ],
      "nuclear": [
        107,
        138
      ]
    },
    "overrides": {
      "wind": {
        "page": 6,
        "pdfPage": 7,
        "note": "Unsubsidized No Tax Incentives sensitivity."
      },
      "solar": {
        "page": 6,
        "pdfPage": 7,
        "note": "Crystalline ground-mount PV; unsubsidized No Tax Incentives sensitivity."
      },
      "coal": {
        "note": "High case includes 90% carbon capture and compression."
      },
      "nuclear": {
        "note": "Excludes decommissioning costs and potential economic effects of federal loan guarantees or other subsidies."
      }
    },
    "missing": {
      "offshore": "Not reported in this edition, including its assumptions appendix.",
      "existingGas": "Existing-plant marginal operating cost comparison not reported in this edition."
    },
    "note": "U.S.-focused scenarios in 2008 dollars. June 2009 revision; renewable values use the No Tax Incentives sensitivity."
  },
  {
    "year": 2010,
    "version": 4,
    "url": "https://www.puc.pa.gov/pcdocs/1173215.pdf",
    "page": 2,
    "pdfPage": 4,
    "scope": "U.S.-focused scenarios in 2009 dollars. Renewable values use the No Tax Incentives sensitivity.",
    "values": {
      "wind": [
        99,
        148
      ],
      "solar": [
        226,
        270
      ],
      "gas": [
        67,
        96
      ],
      "coal": [
        69,
        152
      ],
      "peaker": [
        231,
        254
      ],
      "nuclear": [
        77,
        114
      ],
      "offshore": {
        "kind": "midpoint",
        "midpoint": 216
      }
    },
    "overrides": {
      "wind": {
        "page": 7,
        "pdfPage": 9,
        "note": "Unsubsidized No Tax Incentives sensitivity."
      },
      "solar": {
        "page": 7,
        "pdfPage": 9,
        "note": "Crystalline ground-mount PV; unsubsidized No Tax Incentives sensitivity."
      },
      "offshore": {
        "page": 7,
        "pdfPage": 9,
        "note": "Published unsubsidized midpoint only; no unsubsidized low–high range is supplied."
      },
      "coal": {
        "note": "High case includes 90% carbon capture and compression."
      },
      "nuclear": {
        "note": "Excludes decommissioning costs and potential economic effects of federal loan guarantees or other subsidies."
      }
    },
    "missing": {
      "existingGas": "Existing-plant marginal operating cost comparison not reported in this edition."
    },
    "note": "U.S.-focused scenarios in 2009 dollars. Renewable values use the No Tax Incentives sensitivity."
  },
  {
    "year": 2011,
    "version": 5,
    "url": "https://web.archive.org/web/20130323094447id_/http://votesolar.org/wp-content/uploads/2012/07/Lazard-June-11-Levelized-Cost-of-Energy-and-proj-to-2020-copy.pdf",
    "page": 2,
    "pdfPage": 3,
    "scope": "U.S.-focused scenarios in 2010 dollars. The renewable sensitivity excludes ITC/PTC while retaining 5-year MACRS treatment.",
    "values": {
      "wind": [
        50,
        92
      ],
      "solar": [
        148,
        166
      ],
      "gas": [
        69,
        97
      ],
      "coal": [
        70,
        152
      ],
      "peaker": [
        211,
        242
      ],
      "nuclear": [
        77,
        113
      ],
      "offshore": {
        "kind": "midpoint",
        "midpoint": 167
      }
    },
    "overrides": {
      "wind": {
        "page": 5,
        "pdfPage": 6,
        "note": "Unsubsidized No Tax Incentives sensitivity."
      },
      "solar": {
        "page": 5,
        "pdfPage": 6,
        "note": "Crystalline ground-mount PV; unsubsidized No Tax Incentives sensitivity."
      },
      "offshore": {
        "page": 5,
        "pdfPage": 6,
        "note": "Published unsubsidized midpoint only; no unsubsidized low–high range is supplied."
      },
      "coal": {
        "note": "High case includes 90% carbon capture and compression."
      },
      "nuclear": {
        "note": "Excludes decommissioning costs and potential economic effects of federal loan guarantees or other subsidies."
      }
    },
    "missing": {
      "existingGas": "Existing-plant marginal operating cost comparison not reported in this edition."
    },
    "note": "U.S.-focused scenarios in 2010 dollars. The renewable sensitivity excludes ITC/PTC while retaining 5-year MACRS treatment."
  },
  {
    "year": 2012,
    "version": 6,
    "url": "https://archive.legmt.gov/content/Committees/Interim/2013-2014/Energy-and-Telecommunications/Meetings/September-2013/Day2Exhibit10.pdf",
    "page": 2,
    "pdfPage": 3,
    "scope": "U.S.-focused scenarios. Headline analysis is unsubsidized; solar assumes a high-insolation region.",
    "values": {
      "wind": [
        48,
        95
      ],
      "solar": [
        101,
        149
      ],
      "gas": [
        61,
        89
      ],
      "coal": [
        62,
        141
      ],
      "offshore": [
        110,
        199
      ],
      "peaker": [
        200,
        231
      ],
      "nuclear": [
        77,
        114
      ]
    },
    "overrides": {
      "solar": {
        "note": "Crystalline utility-scale PV; projected future-cost and thin-film cases excluded."
      },
      "offshore": {
        "page": 13,
        "pdfPage": 14,
        "note": "Low–high range from the annual assumptions appendix."
      },
      "coal": {
        "note": "High case includes 90% carbon capture and compression."
      },
      "nuclear": {
        "note": "Excludes decommissioning costs and potential economic effects of federal loan guarantees or other subsidies."
      }
    },
    "missing": {
      "existingGas": "Existing-plant marginal operating cost comparison not reported in this edition."
    },
    "note": "U.S.-focused scenarios. Headline analysis is unsubsidized; solar assumes a high-insolation region."
  },
  {
    "year": 2013,
    "version": 7,
    "url": "https://gallery.mailchimp.com/ce17780900c3d223633ecfa59/files/Lazard_Levelized_Cost_of_Energy_v7.0.1.pdf",
    "page": 2,
    "pdfPage": 3,
    "scope": "Illustrative financing and high-insolation solar assumptions; scope differs from recent U.S.-focused editions.",
    "values": {
      "wind": [
        45,
        95
      ],
      "solar": [
        91,
        104
      ],
      "gas": [
        61,
        87
      ],
      "coal": [
        65,
        145
      ],
      "peaker": [
        179,
        230
      ],
      "nuclear": [
        86,
        122
      ],
      "offshore": [
        110,
        200
      ]
    },
    "overrides": {
      "offshore": {
        "page": 14,
        "pdfPage": 15,
        "note": "Low–high range from the annual assumptions appendix."
      },
      "coal": {
        "note": "High case includes 90% carbon capture; excludes CO2 transport and storage."
      },
      "solar": {
        "note": "Crystalline utility-scale PV; projected future-cost and thin-film cases excluded."
      }
    },
    "missing": {},
    "note": "Illustrative financing and high-insolation solar assumptions; scope differs from recent U.S.-focused editions."
  },
  {
    "year": 2014,
    "version": 8,
    "url": "https://www.energy.gov/sites/prod/files/2015/04/f22/CleanLinePt2-Appendix-3-B.PDF",
    "page": 2,
    "pdfPage": 5,
    "scope": "Illustrative financing and high-insolation solar assumptions; scope differs from recent U.S.-focused editions.",
    "values": {
      "wind": [
        37,
        81
      ],
      "solar": [
        72,
        86
      ],
      "gas": [
        61,
        87
      ],
      "coal": [
        66,
        151
      ],
      "peaker": [
        179,
        230
      ],
      "nuclear": [
        92,
        132
      ],
      "offshore": [
        110,
        214
      ]
    },
    "overrides": {
      "offshore": {
        "page": 17,
        "pdfPage": 20,
        "note": "Low–high range from the annual assumptions appendix."
      },
      "coal": {
        "note": "High case includes 90% carbon capture; excludes CO2 transport and storage."
      },
      "solar": {
        "note": "Crystalline utility-scale PV; projected future-cost and thin-film cases excluded."
      }
    },
    "missing": {},
    "note": "Illustrative financing and high-insolation solar assumptions; scope differs from recent U.S.-focused editions."
  },
  {
    "year": 2015,
    "version": 9,
    "url": "https://www.energy.nv.gov/siteassets/content/programs/NEITS_003_Agenda_5_lazards-levelized-cost-of-energy-analysis-90.pdf",
    "page": 2,
    "pdfPage": 3,
    "scope": "Illustrative financing and high-insolation solar assumptions; scope differs from recent U.S.-focused editions.",
    "values": {
      "wind": [
        32,
        77
      ],
      "solar": [
        58,
        70
      ],
      "gas": [
        52,
        78
      ],
      "coal": [
        65,
        150
      ],
      "peaker": [
        165,
        218
      ],
      "nuclear": [
        97,
        136
      ],
      "offshore": [
        105,
        198
      ]
    },
    "overrides": {
      "offshore": {
        "page": 17,
        "pdfPage": 18,
        "note": "Low–high range from the annual assumptions appendix."
      },
      "coal": {
        "note": "High case includes 90% carbon capture; excludes CO2 transport and storage."
      },
      "solar": {
        "note": "Crystalline utility-scale PV; projected future-cost and thin-film cases excluded."
      }
    },
    "missing": {},
    "note": "Illustrative financing and high-insolation solar assumptions; scope differs from recent U.S.-focused editions."
  },
  {
    "year": 2016,
    "version": 10,
    "url": "https://wecanfigurethisout.org/ENERGY/Web_notes/Technology_Comparisons/Plant_Economics_Supporting_Files/Lazard%20-%202016%20-%20LCOE%2010.pdf",
    "page": 2,
    "pdfPage": 3,
    "scope": "Illustrative financing and high-insolation solar assumptions; scope differs from recent U.S.-focused editions.",
    "values": {
      "wind": [
        32,
        62
      ],
      "solar": [
        49,
        61
      ],
      "gas": [
        48,
        78
      ],
      "coal": [
        60,
        143
      ],
      "peaker": [
        165,
        217
      ],
      "nuclear": [
        97,
        136
      ],
      "offshore": [
        82,
        155
      ]
    },
    "overrides": {
      "offshore": {
        "page": 19,
        "pdfPage": 20,
        "note": "Low–high range from the annual assumptions appendix."
      },
      "coal": {
        "note": "High case includes 90% carbon capture; excludes CO2 transport and storage."
      },
      "solar": {
        "note": "Crystalline utility-scale PV; projected future-cost and thin-film cases excluded."
      }
    },
    "missing": {},
    "note": "Illustrative financing and high-insolation solar assumptions; scope differs from recent U.S.-focused editions."
  },
  {
    "year": 2017,
    "version": 11,
    "url": "https://www.ourenergypolicy.org/wp-content/uploads/2018/03/lazard-levelized-cost-of-energy-version-110.pdf",
    "page": 2,
    "pdfPage": 3,
    "scope": "Illustrative financing and high-insolation solar assumptions; scope differs from recent U.S.-focused editions.",
    "values": {
      "wind": [
        30,
        60
      ],
      "solar": [
        46,
        53
      ],
      "gas": [
        42,
        78
      ],
      "coal": [
        60,
        143
      ],
      "offshore": [
        71,
        155
      ],
      "peaker": [
        156,
        210
      ],
      "nuclear": [
        112,
        183
      ]
    },
    "overrides": {
      "offshore": {
        "page": 19,
        "pdfPage": 20,
        "note": "Low–high range from the annual assumptions appendix."
      },
      "coal": {
        "note": "High case includes 90% carbon capture; excludes CO2 transport and storage."
      },
      "solar": {
        "note": "Crystalline utility-scale PV; projected future-cost and thin-film cases excluded."
      }
    },
    "missing": {
      "existingGas": "No marginal operating cost series for existing gas CC is reported in this edition."
    },
    "note": "Illustrative financing and high-insolation solar assumptions; scope differs from recent U.S.-focused editions."
  },
  {
    "year": 2018,
    "version": 12,
    "url": "https://www.ourenergypolicy.org/wp-content/uploads/2018/12/lazards-levelized-cost-of-energy-version-120-vfinal.pdf",
    "page": 2,
    "pdfPage": 3,
    "scope": "Illustrative financing and high-insolation solar assumptions; scope differs from recent U.S.-focused editions.",
    "values": {
      "wind": [
        29,
        56
      ],
      "solar": [
        40,
        46
      ],
      "gas": [
        41,
        74
      ],
      "coal": [
        60,
        143
      ],
      "offshore": [
        62,
        121
      ],
      "peaker": [
        152,
        206
      ],
      "nuclear": [
        112,
        189
      ]
    },
    "overrides": {
      "offshore": {
        "page": 17,
        "pdfPage": 18,
        "note": "Low–high range from the annual assumptions appendix."
      },
      "coal": {
        "note": "High case includes 90% carbon capture; excludes CO2 transport and storage."
      },
      "solar": {
        "note": "Crystalline utility-scale PV; projected future-cost and thin-film cases excluded."
      }
    },
    "missing": {
      "existingGas": "Marginal costs in this edition cover existing coal and nuclear, not gas CC."
    },
    "note": "Illustrative financing and high-insolation solar assumptions; scope differs from recent U.S.-focused editions."
  },
  {
    "year": 2019,
    "version": 13,
    "url": "https://alaskarenewableenergy.org/wp-content/uploads/2020/04/lazards-levelized-cost-of-energy-version-130-vf.pdf",
    "page": 2,
    "pdfPage": 3,
    "scope": "Global illustrative assumptions; headline estimates do not represent a particular geography.",
    "values": {
      "wind": [
        28,
        54
      ],
      "solar": [
        36,
        44
      ],
      "gas": [
        44,
        68
      ],
      "coal": [
        66,
        152
      ],
      "offshore": [
        64,
        115
      ],
      "peaker": [
        150,
        199
      ],
      "nuclear": [
        118,
        192
      ]
    },
    "overrides": {
      "offshore": {
        "page": 17,
        "pdfPage": 18,
        "note": "Low–high range from the annual assumptions appendix."
      },
      "coal": {
        "note": "High case includes 90% carbon capture; excludes CO2 transport and storage."
      },
      "solar": {
        "note": "Crystalline utility-scale PV; projected future-cost and thin-film cases excluded."
      }
    },
    "missing": {
      "existingGas": "Marginal costs in this edition cover existing coal and nuclear, not gas CC."
    },
    "note": "Global illustrative assumptions; headline estimates do not represent a particular geography."
  },
  {
    "year": 2020,
    "version": 14,
    "url": "https://web.archive.org/web/20210128105700id_/https://www.lazard.com/media/451419/lazards-levelized-cost-of-energy-version-140.pdf",
    "page": 2,
    "pdfPage": 3,
    "scope": "Global illustrative assumptions; headline estimates do not represent a particular geography.",
    "values": {
      "wind": [
        26,
        54
      ],
      "solar": [
        31,
        42
      ],
      "gas": [
        44,
        73
      ],
      "coal": [
        65,
        159
      ],
      "offshore": [
        69,
        104
      ],
      "peaker": [
        151,
        198
      ],
      "nuclear": [
        129,
        198
      ],
      "existingGas": [
        23,
        32
      ]
    },
    "overrides": {
      "offshore": {
        "page": 17,
        "pdfPage": 18,
        "note": "Low–high range from the annual assumptions appendix."
      },
      "existingGas": {
        "page": 7,
        "pdfPage": 8,
        "note": "Marginal operating cost of fully depreciated gas CC; excludes initial construction investment."
      },
      "coal": {
        "note": "High case includes 90% carbon capture; excludes CO2 transport and storage."
      },
      "solar": {
        "note": "Crystalline utility-scale PV; projected future-cost and thin-film cases excluded."
      }
    },
    "missing": {},
    "note": "Global illustrative assumptions; headline estimates do not represent a particular geography."
  },
  {
    "year": 2021,
    "version": 15,
    "url": "https://ser-colombia.org/wp-content/uploads/2021/11/lazards-levelized-cost-of-energy-version-150-vf.pdf",
    "page": 2,
    "pdfPage": 3,
    "scope": "Global illustrative assumptions; headline estimates do not represent a particular geography.",
    "values": {
      "wind": [
        26,
        50
      ],
      "solar": [
        30,
        41
      ],
      "gas": [
        45,
        74
      ],
      "coal": [
        65,
        152
      ],
      "offshore": [
        66,
        100
      ],
      "peaker": [
        151,
        196
      ],
      "nuclear": [
        131,
        204
      ],
      "existingGas": [
        19,
        29
      ]
    },
    "overrides": {
      "offshore": {
        "page": 17,
        "pdfPage": 18,
        "note": "Low–high range from the annual assumptions appendix."
      },
      "existingGas": {
        "page": 7,
        "pdfPage": 8,
        "note": "Marginal operating cost of fully depreciated gas CC; excludes initial construction investment."
      },
      "coal": {
        "note": "High case includes 90% carbon capture; excludes CO2 transport and storage."
      },
      "solar": {
        "note": "Crystalline utility-scale PV; projected future-cost and thin-film cases excluded."
      }
    },
    "missing": {},
    "note": "Global illustrative assumptions; headline estimates do not represent a particular geography."
  },
  {
    "year": 2023,
    "version": 16,
    "url": "https://www.lazard.com/media/2ozoovyg/lazards-lcoeplus-april-2023.pdf",
    "page": 2,
    "pdfPage": 5,
    "scope": "U.S.-focused annual estimates. Financing, fuel and technology assumptions differ across editions.",
    "values": {
      "wind": [
        24,
        75
      ],
      "solar": [
        24,
        96
      ],
      "gas": [
        39,
        101
      ],
      "coal": [
        68,
        166
      ],
      "offshore": [
        72,
        140
      ],
      "peaker": [
        115,
        221
      ],
      "nuclear": [
        141,
        221
      ],
      "existingGas": [
        51,
        73
      ]
    },
    "overrides": {
      "existingGas": {
        "page": 7,
        "pdfPage": 10,
        "note": "Existing-gas comparison assumes $6.85/MMBtu natural gas, while the new-build comparison uses $3.45/MMBtu."
      },
      "coal": {
        "note": "Inflation-adjusted estimate; high case includes 90% carbon capture, excluding CO2 transport and storage."
      },
      "nuclear": {
        "note": "Prior estimate adjusted for inflation; based on then-estimated Vogtle costs."
      }
    },
    "missing": {},
    "note": "U.S.-focused annual estimates. Financing, fuel and technology assumptions differ across editions."
  },
  {
    "year": 2024,
    "version": 17,
    "url": "https://www.lazard.com/media/xemfey0k/lazards-lcoeplus-june-2024-_vf.pdf",
    "page": 9,
    "pdfPage": 9,
    "scope": "U.S.-focused annual estimates. Financing, fuel and technology assumptions differ across editions.",
    "values": {
      "wind": [
        27,
        73
      ],
      "solar": [
        29,
        92
      ],
      "gas": [
        45,
        108
      ],
      "coal": [
        69,
        168
      ],
      "offshore": [
        74,
        139
      ],
      "peaker": [
        110,
        228
      ],
      "nuclear": [
        142,
        222
      ],
      "existingGas": [
        23,
        37
      ]
    },
    "overrides": {
      "existingGas": {
        "page": 14,
        "pdfPage": 14
      },
      "coal": {
        "note": "Lazard v14.0 results adjusted for inflation; excludes transport and storage."
      },
      "nuclear": {
        "note": "Lazard v14.0 results adjusted for inflation, based on then-estimated Vogtle costs."
      }
    },
    "missing": {},
    "note": "U.S.-focused annual estimates. Financing, fuel and technology assumptions differ across editions."
  },
  {
    "year": 2025,
    "version": 18,
    "url": "https://www.lazard.com/media/5tlbhyla/lazards-lcoeplus-june-2025-_vf.pdf",
    "page": 8,
    "pdfPage": 8,
    "scope": "U.S.-focused annual estimates. Financing, fuel and technology assumptions differ across editions.",
    "values": {
      "wind": [
        37,
        86
      ],
      "solar": [
        38,
        78
      ],
      "gas": [
        48,
        109
      ],
      "coal": [
        71,
        173
      ],
      "offshore": [
        70,
        157
      ],
      "peaker": [
        149,
        251
      ],
      "nuclear": [
        141,
        220
      ],
      "existingGas": [
        24,
        39
      ]
    },
    "overrides": {
      "existingGas": {
        "page": 13,
        "pdfPage": 13
      },
      "coal": {
        "note": "Lazard v14.0 results adjusted for inflation; excludes transport and storage."
      },
      "nuclear": {
        "note": "Lazard v14.0 results adjusted for inflation, based on then-estimated Vogtle costs; additional illustrative Vogtle points are excluded."
      }
    },
    "missing": {},
    "note": "U.S.-focused annual estimates. Financing, fuel and technology assumptions differ across editions."
  },
  {
    "year": 2026,
    "version": 19,
    "url": "https://www.lazard.com/media/kcfconhf/lazards-lcoeplus_vf.pdf",
    "page": 7,
    "pdfPage": 7,
    "scope": "U.S.-focused annual estimates. Financing, fuel and technology assumptions differ across editions.",
    "values": {
      "wind": [
        37,
        99
      ],
      "solar": [
        40,
        98
      ],
      "gas": [
        51,
        129
      ],
      "coal": [
        72,
        177
      ],
      "offshore": [
        105,
        167
      ],
      "peaker": [
        144,
        276
      ],
      "nuclear": [
        175,
        255
      ],
      "existingGas": [
        32,
        51
      ]
    },
    "overrides": {
      "existingGas": {
        "page": 12,
        "pdfPage": 12
      },
      "coal": {
        "note": "Lazard v14.0 results adjusted for inflation; excludes transport and storage."
      },
      "nuclear": {
        "note": "Range reflects completed Vogtle units 3 and 4; illustrative restart and SMR estimates are excluded."
      }
    },
    "missing": {},
    "note": "U.S.-focused annual estimates. Financing, fuel and technology assumptions differ across editions."
  }
];
  const technologies = [
    {id:'wind',name:'Onshore wind',color:'#397ea7',group:'new'},
    {id:'solar',name:'Utility solar',color:'#c98616',group:'new'},
    {id:'gas',name:'Gas combined cycle',color:'#65756f',group:'new'},
    {id:'coal',name:'Coal',color:'#5a5c5b',group:'new'},
    {id:'offshore',name:'Offshore wind',color:'#397ea7',group:'new'},
    {id:'peaker',name:'Gas peaker',color:'#89958e',group:'new'},
    {id:'nuclear',name:'Nuclear',color:'#5a5c5b',group:'new'},
    {id:'existingGas',name:'Existing gas CC',color:'#a6aaa7',group:'existing'}
  ];
  const data=reports.map(r=>{
    const values={};
    for(const [id,raw] of Object.entries(r.values)){
      const override=r.overrides[id]||{};
      const value=Array.isArray(raw)?{kind:'range',low:raw[0],high:raw[1],midpoint:(raw[0]+raw[1])/2}:{...raw};
      values[id]={...value,source:r.url,sourceYear:r.year,sourceVersion:r.version,page:r.page,pdfPage:r.pdfPage,...override};
    }
    const unavailable={};
    for(const t of technologies)if(!values[t.id])unavailable[t.id]=r.missing[t.id]||'This comparison was not reported in this edition.';
    return {year:r.year,version:r.version,source:r.url,scope:r.scope,values,unavailable,note:r.note||r.scope};
  });
  const years=data.map(r=>r.year);
  const source=reports.at(-1).url;
  const axisMax=Math.ceil(Math.max(...data.flatMap(r=>Object.values(r.values).map(v=>v.high??v.midpoint)))/100)*100;
  function snapshot(year){const row=data.find(r=>r.year===Number(year));if(!row)throw new RangeError('No annual report observation for '+year);return row;}
  const cell=value=>{const s=String(value??'');return /[",\r\n]/.test(s)?'"'+s.replaceAll('"','""')+'"':s;};
  function csv(year){
    const records=year==null?data:[snapshot(year)];
    const lines=['year,lazard_version,technology,basis,value_type,low_usd_per_mwh,high_usd_per_mwh,midpoint_usd_per_mwh,source_url,source_page,pdf_page,note,report_scope'];
    for(const r of records)for(const t of technologies){
      const v=r.values[t.id];if(!v)continue;
      lines.push([r.year,r.version+'.0',t.name,t.group==='existing'?'existing plant marginal operating cost':'new-build unsubsidized LCOE',v.kind,v.low,v.high,v.midpoint,v.source,v.page,v.pdfPage,v.note||'',r.scope].map(cell).join(','));
    }
    return lines.join('\r\n')+'\r\n';
  }
  const api={source,years,technologies,data,axisMax,snapshot,csv};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LCOEData=api;
})(typeof globalThis!=='undefined'?globalThis:this);

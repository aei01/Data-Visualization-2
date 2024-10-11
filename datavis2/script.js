// Visualization 1: CO2 Emissions per Capita map (2022)
var spec2 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 750,
    "height": 500,
    "projection": {"type": "equalEarth"},
    "layer": [
        {
            "data": {
                "url": "https://raw.githubusercontent.com/FIT3179/Vega-Lite/main/2_symbol_map/js/ne_110m_admin_0_countries.topojson",
                "format": {"type": "topojson", "feature": "ne_110m_admin_0_countries"}
            },
            "mark": {"type": "geoshape", "fill": "lightgray", "stroke": "white"},
            "encoding": {
                "tooltip": [{"field": "properties.NAME", "type": "nominal", "title": "Country Name"}]
            }
        },
        {
            "data": {
                "url": "https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv",
                "format": {"type": "csv"}
            },
            "transform": [
                {"filter": "datum.year == 2022"},
                {
                    "calculate": "datum.country == 'Bosnia and Herzegovina' ? 'Bosnia and Herz.' :datum.country == 'North Macedonia' ? 'Macedonia' :datum.country == 'Eswatini' ? 'eSwatini' :datum.country == 'Equatorial Guinea' ? 'Eq. Guinea' :datum.country == 'Dominican Republic' ? 'Dominican Rep.' :datum.country == 'Somalia' ? 'Somaliland' :datum.country == 'Central African Republic' ? 'Central African Rep.' : datum.country == 'South Sudan' ? 'S. Sudan' : datum.country == 'United States' ? 'United States of America' : datum.country == 'Democratic Republic of Congo' ? 'Dem. Rep. Congo' : datum.country", 
                    "as": "mapped_country"
                },
                {
                    "lookup": "mapped_country",
                    "from": {
                        "data": {
                            "url": "https://raw.githubusercontent.com/FIT3179/Vega-Lite/main/2_symbol_map/js/ne_110m_admin_0_countries.topojson",
                            "format": {"type": "topojson", "feature": "ne_110m_admin_0_countries"}
                        },
                        "key": "properties.NAME",
                        "fields": ["properties", "type", "geometry"]
                    }
                }
            ],
            "mark": {"type": "geoshape"},
            "encoding": {
                "color": {
                    "field": "co2_per_capita",
                    "type": "quantitative",
                    "title": "CO2 Emissions per Capita",
                    "scale": {
                        "domain": [0, 20],
                        "range": ["#B0E0E6", "#1E90FF", "#00008B"]
                    }
                },
                "tooltip": [
                    {"field": "mapped_country", "type": "nominal", "title": "Country"},
                    {"field": "co2_per_capita", "type": "quantitative", "title": "CO2 per Capita (metric tons)"}
                ]
            }
        }
    ]
};

vegaEmbed('#vis2', spec2).catch(console.error);

// Visualization 2: Global Temperature Anomalies (1850-Present)
var spec3 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "data": {
        "url": "https://raw.githubusercontent.com/aei01/globalanomalies/refs/heads/main/temperature-anomaly.csv",
        "format": {"type": "csv"}
    },
    "mark": "bar",
    "encoding": {
        "x": {"field": "Year", "type": "temporal", "title": "Year"},
        "y": {"field": "Global average temperature anomaly relative to 1961-1990", "type": "quantitative", "title": "Temperature Anomaly (°C)"},
        "color": {
            "condition": {"test": "datum['Global average temperature anomaly relative to 1961-1990'] > 0", "value": "#1E90FF"},
            "value": "#00008B"
        },
        "tooltip": [
            {"field": "Year", "type": "temporal", "title": "Year"},
            {"field": "Global average temperature anomaly relative to 1961-1990", "type": "quantitative", "title": "Temperature Anomaly (°C)"}
        ]
    },
    "width": 600,
    "height": 300
};

vegaEmbed('#vis3', spec3).catch(console.error);

// Visualization 3: Top 10 Countries Contribution to Global Warming
var spec4 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "data": {
        "url": "https://raw.githubusercontent.com/aei01/gas-emissions-country/refs/heads/main/contributions-global-temp-change.csv",
        "format": {"type": "csv"}
    },
    "transform": [
        {"filter": "datum.Year >= 1990 && datum.Year <= 2020"},
        {
            "filter": "datum.Entity != 'World' && datum.Entity != 'OECD (Jones et al.)' && datum.Entity != 'High-income countries' && datum.Entity != 'Upper-middle-income countries' && datum.Entity != 'Asia' && datum.Entity != 'Europe' && datum.Entity != 'North America' && datum.Entity != 'South America' && datum.Entity != 'Africa' && datum.Entity != 'Lower-middle-income countries' && datum.Entity != 'European Union (28)' && datum.Entity != 'Europe (excl. EU-27)' && datum.Entity != 'Least developed countries (Jones et al.)' && datum.Entity != 'Asia (excl. China and India)' && datum.Entity != 'European Union (27)' && datum.Entity != 'North America (excl. USA)' && datum.Entity != 'Europe (excl. EU-28)' && datum.Entity != 'Low-income countries' && datum.Entity != 'Oceania' && datum.Entity != 'United Kingdom'"
        },
        {
            "aggregate": [{"op": "sum", "field": "Share of contribution to global warming", "as": "TotalContribution"}],
            "groupby": ["Entity"]
        },
        {"joinaggregate": [{"op": "sum", "field": "TotalContribution", "as": "OverallTotal"}]},
        {"calculate": "datum.TotalContribution / datum.OverallTotal * 100", "as": "PercentageContribution"},
        {"window": [{"op": "rank", "as": "Rank"}], "sort": [{"field": "PercentageContribution", "order": "descending"}]},
        {"filter": "datum.Rank <= 10"}
    ],
    "mark": "bar",
    "encoding": {
        "x": {"field": "PercentageContribution", "type": "quantitative", "title": "Percentage Contribution to Global Warming (%)"},
        "y": {"field": "Entity", "type": "nominal", "sort": "-x", "title": "Country"},
        "color": {
            "field": "PercentageContribution",
            "type": "quantitative",
            "scale": {
                "domain": [5, 20],
                "range": ["#B0E0E6", "#1E90FF", "#00008B"]
            },
            "title": "Percentage Contribution"
        },
        "tooltip": [
            {"field": "Entity", "type": "nominal", "title": "Country"},
            {"field": "PercentageContribution", "type": "quantitative", "title": "Percentage Contribution (%)"}
        ]
    },
    "width": 700,
    "height": 300
};

vegaEmbed('#vis4', spec4).catch(console.error);

// Visualization 4: Greenhouse Gas Emissions by Sector (2020) - Pie Chart
var spec5 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "data": {
        "url": "https://raw.githubusercontent.com/aei01/causebysector/refs/heads/main/ghg-emissions-by-sector.csv",
        "format": {"type": "csv"}
    },
    "transform": [
        {"filter": "datum.Year == 2020"},
        {
            "fold": [
                "Greenhouse gas emissions from agriculture", 
                "Greenhouse gas emissions from land use change and forestry",
                "Greenhouse gas emissions from waste", 
                "Greenhouse gas emissions from buildings",
                "Greenhouse gas emissions from industry", 
                "Greenhouse gas emissions from manufacturing and construction",
                "Greenhouse gas emissions from transport", 
                "Greenhouse gas emissions from electricity and heat",
                "Fugitive emissions of greenhouse gases from energy production", 
                "Greenhouse gas emissions from other fuel combustion",
                "Greenhouse gas emissions from bunker fuels"
            ],
            "as": ["Sector", "Emissions"]
        },
        {
            "calculate": "datum.Sector === 'Greenhouse gas emissions from agriculture' ? 'Agriculture' : datum.Sector === 'Greenhouse gas emissions from land use change and forestry' ? 'Land Use/Forestry' : datum.Sector === 'Greenhouse gas emissions from waste' ? 'Waste' : datum.Sector === 'Greenhouse gas emissions from buildings' ? 'Buildings' : datum.Sector === 'Greenhouse gas emissions from industry' ? 'Industry' : datum.Sector === 'Greenhouse gas emissions from manufacturing and construction' ? 'Manufacturing' : datum.Sector === 'Greenhouse gas emissions from transport' ? 'Transport' : datum.Sector === 'Greenhouse gas emissions from electricity and heat' ? 'Electricity/Heat' : datum.Sector === 'Fugitive emissions of greenhouse gases from energy production' ? 'Energy Fugitive' : datum.Sector === 'Greenhouse gas emissions from other fuel combustion' ? 'Other Fuel' : 'Bunker Fuels'",
            "as": "RenamedSector"
        },
        {
            "aggregate": [{"op": "sum", "field": "Emissions", "as": "TotalEmissions"}],
            "groupby": ["RenamedSector"]
        },
        {"window": [{"op": "sum", "field": "TotalEmissions", "as": "SumEmissions"}], "frame": [null, null]},
        {"calculate": "datum.TotalEmissions / datum.SumEmissions * 100", "as": "Percentage"}
    ],
    "mark": {"type": "arc", "innerRadius": 50},
    "encoding": {
        "theta": {"field": "TotalEmissions", "type": "quantitative", "title": "Emissions (in tons)"},
        "color": {
            "field": "RenamedSector",
            "type": "nominal",
            "scale": {
                "domain": [
                    "Agriculture", "Buildings", "Bunker Fuels", "Electricity/Heat", "Energy Fugitive", 
                    "Industry", "Land Use/Forestry", "Manufacturing", "Other Fuel", "Transport", "Waste"
                ],
                "range": ["#B0E0E6", "#ADD8E6", "#87CEEB", "#00008B", "#4682B4", "#5F9EA0", "#7B68EE", "#6495ED", "#4169E1", "#1E90FF", "#00BFFF"]
            },
            "legend": {"title": "Sector"}
        },
        "tooltip": [
            {"field": "RenamedSector", "type": "nominal", "title": "Sector"},
            {"field": "Percentage", "type": "quantitative", "title": "Percentage of Total Emissions", "format": ".2f"}
        ]
    },
    "width": 400,
    "height": 400
};

vegaEmbed('#vis5', spec5).catch(console.error);

// Visualization 5: Greenhouse Gas Emissions by Sector Over Time - Area Chart
var spec6 = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "data": {
        "url": "https://raw.githubusercontent.com/aei01/causebysector/refs/heads/main/ghg-emissions-by-sector.csv",
        "format": {"type": "csv"}
    },
    "transform": [
        {"filter": "datum.Entity == 'World'"},
        {"fold": [
            "Greenhouse gas emissions from agriculture", 
            "Greenhouse gas emissions from land use change and forestry",
            "Greenhouse gas emissions from waste", 
            "Greenhouse gas emissions from buildings",
            "Greenhouse gas emissions from industry", 
            "Greenhouse gas emissions from manufacturing and construction",
            "Greenhouse gas emissions from transport", 
            "Greenhouse gas emissions from electricity and heat",
            "Fugitive emissions of greenhouse gases from energy production", 
            "Greenhouse gas emissions from other fuel combustion",
            "Greenhouse gas emissions from bunker fuels"
        ], "as": ["Sector", "Emissions"]},
        {
            "calculate": "datum.Sector === 'Greenhouse gas emissions from agriculture' ? 'Agriculture' : datum.Sector === 'Greenhouse gas emissions from land use change and forestry' ? 'Land Use/Forestry' : datum.Sector === 'Greenhouse gas emissions from waste' ? 'Waste' : datum.Sector === 'Greenhouse gas emissions from buildings' ? 'Buildings' : datum.Sector === 'Greenhouse gas emissions from industry' ? 'Industry' : datum.Sector === 'Greenhouse gas emissions from manufacturing and construction' ? 'Manufacturing' : datum.Sector === 'Greenhouse gas emissions from transport' ? 'Transport' : datum.Sector === 'Greenhouse gas emissions from electricity and heat' ? 'Electricity/Heat' : datum.Sector === 'Fugitive emissions of greenhouse gases from energy production' ? 'Energy Fugitive' : datum.Sector === 'Greenhouse gas emissions from other fuel combustion' ? 'Other Fuel' : 'Bunker Fuels'",
            "as": "RenamedSector"
        },
        {"aggregate": [{"op": "sum", "field": "Emissions", "as": "TotalEmissions"}], "groupby": ["Year", "RenamedSector"]}
    ],
    "mark": {"type": "area", "line": true, "color": "lightblue"},
    "encoding": {
        "x": {"field": "Year", "type": "temporal", "title": "Year"},
        "y": {"field": "TotalEmissions", "type": "quantitative", "title": "Total Emissions"},
        "color": {
            "field": "RenamedSector",
            "type": "nominal",
            "scale": {
                "domain": [
                    "Agriculture", "Buildings", "Bunker Fuels", "Electricity/Heat", "Energy Fugitive", 
                    "Industry", "Land Use/Forestry", "Manufacturing", "Other Fuel", "Transport", "Waste"
                ],
                "range": ["#B0E0E6", "#ADD8E6", "#87CEEB", "#00008B", "#4682B4", "#5F9EA0", "#7B68EE", "#6495ED", "#4169E1", "#1E90FF", "#00BFFF"]
            },
            "legend": {"title": "Sector"}
        },
        "tooltip": [
            {"field": "Year", "type": "temporal", "title": "Year"},
            {"field": "TotalEmissions", "type": "quantitative", "title": "Total Emissions"},
            {"field": "RenamedSector", "type": "nominal", "title": "Sector"}
        ]
    },
    "width": 500,
    "height": 300
};

vegaEmbed('#vis6', spec6).catch(console.error);

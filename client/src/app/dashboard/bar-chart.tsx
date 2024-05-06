"use client"
import { BarChart } from '@tremor/react';

const chartdata = [
    {
        name: 'Amphibians',
        'Number of threatened species - ': 2488,
    },
    {
        name: 'Birds',
        'Number of threatened species - ': 1445,
    },
    {
        name: 'Crustaceans',
        'Number of threatened species - ': 743,
    },
    {
        name: 'Ferns',
        'Number of threatened species - ': 281,
    },
    {
        name: 'Arachnids',
        'Number of threatened species - ': 251,
    },
    {
        name: 'Corals',
        'Number of threatened species - ': 232,
    },
    {
        name: 'Algae',
        'Number of threatened species - ': 98,
    },
];

const dataFormatter = (number: number) => Intl.NumberFormat('us').format(number).toString();

export const BarChartHero = () => (
    // <BarChart
    //     showAnimation={true}
    //     showGridLines={true}
    //     suppressHydrationWarning={true}
    //     showLegend={true}
    //     className="h-[500px] mt-5"
    //     data={chartdata}
    //     index="name"
    //     categories={['Number of threatened species - ']}
    //     colors={['black']}
    //     valueFormatter={dataFormatter}
    //     yAxisWidth={48}
    //     onValueChange={(v) => console.log(v)}
    // />
    <BarChart
        data={chartdata}
        index="name"
        valueFormatter={dataFormatter}
        yAxisWidth={48}
        onValueChange={(v) => console.log(v)}
        showAnimation={true}
        showGridLines={true}
        suppressHydrationWarning={true}
        showLegend={true}
        className="h-[500px] mt-5"
        categories={['Number of threatened species - ']}
    />
);
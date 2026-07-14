import React from 'react';
import { FilterState } from '../types';
import { SlidersHorizontal, RotateCcw, Search, Calendar, Landmark, IndianRupee, Layers } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableScales: string[];
  availableSeries: string[];
  availableYears: number[];
  totalResultsCount: number;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange,
  availableScales,
  availableSeries,
  availableYears,
  totalResultsCount,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const toggleScale = (scale: string) => {
    const nextScales = filters.scale.includes(scale)
      ? filters.scale.filter((s) => s !== scale)
      : [...filters.scale, scale];
    onFiltersChange({ ...filters, scale: nextScales });
  };

  const toggleSeries = (series: string) => {
    const nextSeries = filters.series.includes(series)
      ? filters.series.filter((s) => s !== series)
      : [...filters.series, series];
    onFiltersChange({ ...filters, series: nextSeries });
  };

  const toggleYear = (year: number) => {
    const nextYears = filters.year.includes(year)
      ? filters.year.filter((y) => y !== year)
      : [...filters.year, year];
    onFiltersChange({ ...filters, year: nextYears });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: [min, max] });
  };

  const handleReset = () => {
    onFiltersChange({
      search: '',
      scale: [],
      series: [],
      year: [],
      priceRange: [0, 10000],
      sortBy: 'featured',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.scale.length > 0 ||
    filters.series.length > 0 ||
    filters.year.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 10000;

  return (
    <div className="bg-[#131315] border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-6 select-none h-fit">
      {/* Filters Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#cca43b]" />
          <h2 className="font-display font-bold text-base text-white tracking-wide">COLLECTION FILTERS</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-500 font-mono transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* 1. Keyword Search */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Search className="w-3.5 h-3.5" /> Keyword Search
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search models, colors, SKU..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#cca43b] text-zinc-200 placeholder-zinc-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors duration-200 font-sans"
          />
        </div>
      </div>

      {/* 2. Scale Selection */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" /> Diecast Scale
        </label>
        <div className="grid grid-cols-2 gap-2">
          {availableScales.map((scale) => {
            const isSelected = filters.scale.includes(scale);
            return (
              <button
                key={scale}
                onClick={() => toggleScale(scale)}
                className={`px-3 py-2 text-xs font-mono font-bold rounded-xl border text-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#cca43b]/10 border-[#cca43b] text-[#cca43b]'
                    : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700/80 hover:text-zinc-200'
                }`}
              >
                {scale}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Series Selection */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Landmark className="w-3.5 h-3.5" /> Release Series
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableSeries.map((series) => {
            const isSelected = filters.series.includes(series);
            return (
              <button
                key={series}
                onClick={() => toggleSeries(series)}
                className={`px-3 py-1.5 text-xs font-sans rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#cca43b] border-transparent text-black font-semibold shadow-sm'
                    : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                {series}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Release Year */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" /> Release Year
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {availableYears.map((year) => {
            const isSelected = filters.year.includes(year);
            return (
              <button
                key={year}
                onClick={() => toggleYear(year)}
                className={`px-2 py-1.5 text-xs font-mono rounded-lg border text-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-zinc-100 border-transparent text-zinc-950 font-bold'
                    : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Price Filter */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-mono font-bold text-zinc-400 flex items-center justify-between uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5" /> Price Filter
          </span>
          <span className="text-[#cca43b] font-bold text-xs font-mono">
            ₹{filters.priceRange[0].toLocaleString('en-IN')} - ₹{filters.priceRange[1].toLocaleString('en-IN')}
          </span>
        </label>
        
        {/* Price Slider Presets for cleaner control inside iFrames */}
        <div className="grid grid-cols-2 gap-2 font-mono">
          {[
            { label: 'Under ₹500', range: [0, 500] },
            { label: '₹500 - ₹2,000', range: [500, 2000] },
            { label: '₹2,000 - ₹5,000', range: [2000, 5000] },
            { label: 'Show All', range: [0, 10000] },
          ].map((preset) => {
            const isSelected =
              filters.priceRange[0] === preset.range[0] &&
              filters.priceRange[1] === preset.range[1];
            return (
              <button
                key={preset.label}
                onClick={() => handlePriceRangeChange(preset.range[0], preset.range[1])}
                className={`py-1.5 px-2 text-center text-xs rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-[#cca43b]/10 border-[#cca43b] text-[#cca43b] font-semibold'
                    : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results summary badge */}
      <div className="mt-2 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span>Filtered Models:</span>
        <span className="text-zinc-200 font-bold bg-zinc-900 px-2.5 py-1 rounded-md">
          {totalResultsCount} Cars
        </span>
      </div>
    </div>
  );
};

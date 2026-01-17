import { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO, isValid, setYear, getYear, setMonth, getMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

// Fallback for cn if not available
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

interface DatePickerProps {
    value: string | null;
    onChange: (date: string) => void;
    placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = "Select date" }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'days' | 'years' | 'months'>('days');

    // Initialize viewDate to currently selected date or today
    const [viewDate, setViewDate] = useState(() => {
        if (value && isValid(parseISO(value))) {
            return parseISO(value);
        }
        return new Date();
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const yearsContainerRef = useRef<HTMLDivElement>(null);

    // Sync viewDate if value changes externally
    useEffect(() => {
        if (value && isValid(parseISO(value))) {
            setViewDate(parseISO(value));
        }
    }, [value]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setView('days'); // Reset view on close
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll to current year when switching to years view
    useEffect(() => {
        if (view === 'years' && yearsContainerRef.current) {
            const currentYearBtn = yearsContainerRef.current.querySelector('[data-selected="true"]');
            if (currentYearBtn) {
                currentYearBtn.scrollIntoView({ block: 'center' });
            }
        }
    }, [view]);

    const handlePrevMonth = () => setViewDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setViewDate(prev => addMonths(prev, 1));

    const handleYearClick = (year: number) => {
        setViewDate(prev => setYear(prev, year));
        setView('months'); // After year, pick month
    };

    const handleMonthClick = (monthIndex: number) => {
        setViewDate(prev => setMonth(prev, monthIndex));
        setView('days'); // After month, pick day
    };

    const handleDayClick = (day: Date) => {
        // Format as YYYY-MM-DD
        onChange(format(day, 'yyyy-MM-dd'));
        setIsOpen(false);
    };

    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const selectedDate = value ? parseISO(value) : null;
    const formattedDate = selectedDate && isValid(selectedDate) ? format(selectedDate, 'MMM dd, yyyy') : '';

    const currentYear = new Date().getFullYear();
    const startYear = 1950;
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i).reverse(); // Reverse to show newest first
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Input Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full bg-transparent text-white  cursor-pointer group"
            >
                <span className={classNames("flex-1 font-medium", !formattedDate && "text-zinc-600")}>
                    {formattedDate || placeholder}
                </span>
                <CalendarIcon className="text-zinc-500 group-hover:text-white transition-colors h-5 w-5" />
            </div>

            {/* Calendar Popover */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-[#1E1E1E] border border-zinc-800 rounded-lg shadow-xl p-4 w-[320px] animate-in fade-in zoom-in-95 duration-200">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setView('months')}
                                className={classNames(
                                    "font-semibold text-lg px-3 py-1.5 rounded-lg transition-all text-left border",
                                    view === 'months' ? "bg-zinc-800 border-zinc-600 text-white" : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                )}
                            >
                                {format(viewDate, 'MMMM')}
                            </button>
                            <button
                                onClick={() => setView('years')}
                                className={classNames(
                                    "font-semibold text-lg px-3 py-1.5 rounded-lg transition-all text-left border",
                                    view === 'years' ? "bg-zinc-800 border-zinc-600 text-white" : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                )}
                            >
                                {format(viewDate, 'yyyy')}
                            </button>
                        </div>

                        {view === 'days' && (
                            <div className="flex gap-1 shrink-0">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* View Switching */}
                    {view === 'days' && (
                        <>
                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 mb-2">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                    <div key={`${day}-${i}`} className="text-center text-xs font-medium text-zinc-500 py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-y-1">
                                {calendarDays.map((day) => {
                                    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                                    const isCurrentMonth = isSameMonth(day, viewDate);
                                    const isTodayDate = isToday(day);

                                    return (
                                        <button
                                            key={day.toISOString()}
                                            onClick={() => handleDayClick(day)}
                                            className={classNames(
                                                "h-9 w-9 rounded-full flex items-center justify-center text-sm transition-all mx-auto border",
                                                !isCurrentMonth && "invisible",
                                                isCurrentMonth && !isSelected && "border-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white",
                                                isSelected && "bg-zinc-800 border-zinc-600 text-white font-medium shadow-sm",
                                                !isSelected && isTodayDate && "border-zinc-700 text-white"
                                            )}
                                        >
                                            {format(day, 'd')}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {view === 'months' && (
                        <div className="grid grid-cols-3 gap-2">
                            {months.map((month, index) => {
                                const isSelectedMonth = getMonth(viewDate) === index;
                                return (
                                    <button
                                        key={month}
                                        onClick={() => handleMonthClick(index)}
                                        className={classNames(
                                            "py-3 rounded-xl text-sm transition-all border",
                                            isSelectedMonth ? "bg-zinc-800 border-zinc-600 text-white font-medium" : "border-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                                        )}
                                    >
                                        {month}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {view === 'years' && (
                        <div
                            ref={yearsContainerRef}
                            className="grid grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar"
                        >
                            {years.map((year) => {
                                const isSelectedYear = getYear(viewDate) === year;
                                return (
                                    <button
                                        key={year}
                                        data-selected={isSelectedYear}
                                        onClick={() => handleYearClick(year)}
                                        className={classNames(
                                            "py-2 rounded-xl text-sm transition-all border",
                                            isSelectedYear ? "bg-zinc-800 border-zinc-600 text-white font-medium" : "border-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-white",
                                            getYear(new Date()) === year && !isSelectedYear && "border-zinc-800"
                                        )}
                                    >
                                        {year}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

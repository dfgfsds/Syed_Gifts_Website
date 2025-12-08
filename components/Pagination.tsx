interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];

        pages.push(1);

        if (currentPage > 4) {
            pages.push('...');
        }

        const startPage = Math.max(2, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 3) {
            pages.push('...');
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        // ✅ Fix with Array.from<any>
        return Array.from<any>(new Set(pages));
    };

    const pageList = getPageNumbers();

    return (
        <div className="flex items-center justify-start gap-1 text-sm px-4 py-4">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border rounded disabled:opacity-50 text-green-500 border-green-700"
            >
                &lt;
            </button>

            {pageList.map((page, idx) => {
                if (page === '...') {
                    return <span key={`dots-${idx}`} className="px-2 py-1">...</span>;
                } else {
                    return (
                        <button
                            key={`page-${page}`}
                            onClick={() => onPageChange(Number(page))}
                            className={`px-3 py-1 border-2 rounded cursor-pointer text-green-500 border-green-700 ${page === currentPage ? 'bg-[#4d8b31] hover:bg-green-700 text-white' : ''}`}
                        >
                            {page}
                        </button>
                    );
                }
            })}

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border rounded disabled:opacity-50 text-green-500 border-green-700"
            >
                &gt;
            </button>
        </div>
    );
};

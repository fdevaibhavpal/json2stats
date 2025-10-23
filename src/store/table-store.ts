import { create } from 'zustand';
import { JsonData, ColumnSchema, TableState } from '@/types';
import { FilterGroup } from '@/types/filter.types';
import { JsonParser } from '@/lib/json-parser';
import { DataProcessor } from '@/lib/data-processor';

interface TableStore extends TableState {
  // Actions
  setData: (data: JsonData[]) => void;
  setColumns: (columns: ColumnSchema[]) => void;
  setSearchQuery: (query: string) => void;
  setSort: (column: string, direction: 'asc' | 'desc') => void;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  setFilterGroups: (filterGroups: FilterGroup[]) => void;
  toggleColumnVisibility: (columnKey: string) => void;
  selectRow: (rowId: string) => void;
  selectAllRows: () => void;
  clearSelection: () => void;
  
  // Data processing
  loadJsonData: (jsonString: string) => void;
  getProcessedData: () => {
    data: JsonData[];
    totalPages: number;
    totalItems: number;
    stats: any[];
  };
  
  // Reset
  reset: () => void;
}

const initialState: TableState = {
  data: [],
  columns: [],
  searchQuery: '',
  sortBy: '',
  sortDirection: 'asc',
  pageSize: 20,
  currentPage: 1,
  filters: {},
  filterGroups: [],
  selectedRows: [],
};

export const useTableStore = create<TableStore>((set, get) => ({
  ...initialState,

  setData: (data) => set({ data }),
  
  setColumns: (columns) => set({ columns }),
  
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  
  setSort: (column, direction) => set({ 
    sortBy: column, 
    sortDirection: direction,
    currentPage: 1 
  }),
  
  setPageSize: (size) => set({ 
    pageSize: size, 
    currentPage: 1 
  }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  setFilterGroups: (filterGroups) => set({ 
    filters: filterGroups, 
    currentPage: 1 
  }),
  
  toggleColumnVisibility: (columnKey) => {
    const { columns } = get();
    const updatedColumns = columns.map(col => 
      col.key === columnKey 
        ? { ...col, hidden: !col.hidden }
        : col
    );
    set({ columns: updatedColumns });
  },
  
  selectRow: (rowId) => {
    const { selectedRows } = get();
    const isSelected = selectedRows.includes(rowId);
    const updatedSelection = isSelected
      ? selectedRows.filter(id => id !== rowId)
      : [...selectedRows, rowId];
    set({ selectedRows: updatedSelection });
  },
  
  selectAllRows: () => {
    const { data } = get();
    const allRowIds = data.map((_, index) => `row-${index}`);
    set({ selectedRows: allRowIds });
  },
  
  clearSelection: () => set({ selectedRows: [] }),
  
  loadJsonData: (jsonString) => {
    try {
      const data = JsonParser.parseJson(jsonString);
      const columns = JsonParser.inferSchema(data);
      
      set({
        data,
        columns,
        searchQuery: '',
        sortBy: '',
        sortDirection: 'asc',
        currentPage: 1,
        filters: [],
        selectedRows: [],
      });
    } catch (error) {
      console.error('Failed to load JSON data:', error);
      throw error;
    }
  },
  
  getProcessedData: () => {
    const { data, columns, searchQuery, sortBy, sortDirection, filterGroups, currentPage, pageSize } = get();
    
    if (data.length === 0) {
      return {
        data: [],
        totalPages: 0,
        totalItems: 0,
        stats: [],
      };
    }
    
    const processor = new DataProcessor(data, columns);
    
    return processor.getProcessedData({
      searchQuery,
      sortBy,
      sortDirection,
      filterGroups: filterGroups,
      page: currentPage,
      pageSize,
    });
  },
  
  reset: () => set(initialState),
}));

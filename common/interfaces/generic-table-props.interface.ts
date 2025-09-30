export interface GenericTableProps<T> {
  leftOffset?: number; // fuerza el gap desde afuera (opcional)
  hasSidebar?: boolean;
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  orderBy?: [string, "ASC" | "DESC"];
  onOrderChange?: (field: string, direction: "ASC" | "DESC") => void;
  topRightComponent?: React.ReactNode;

  data: T[] | { data: T[] } | null | undefined;
  caption: string;
  TableHeader: string[];
  renderRow: (row: T, index: number) => React.ReactNode;
  showAddMenu?: boolean;
  onImportOpen?: () => void;
  onCreateOpen?: () => void;
  compact?: boolean;
  filter?: boolean;
  minH?: string;
  paddingX?: number;
  paddingY?: number;
  fontSize?: string;
  marginLeft?: string;
  marginTop?: string;
  width?: string;
  maxWidth?: string;
  padding?: number;
  flex?: string;
  height?: string;
  widthTable?: number;
  isInModal?: boolean;
  careerModalEdit?: boolean;
  subjectModalEdit?: boolean;
  actions?: boolean | null;
}
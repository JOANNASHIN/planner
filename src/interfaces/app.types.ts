//#region 카카오 이미지 검색
/**
 * 정렬 key
 */
type SearchImageSortKey = 'accuracy' | 'recency';

/**
 * 정렬 리스트
 */
interface SearchImageSort {
  value: SearchImageSortKey;
  name: string;
}

/**
 * search 이미지검색 form
 */
interface SearchImageForm {
  query: string;
  sort: SearchImageSortKey;
}

/**
 * 페이지네이션
 */
interface SearchImagePagination {
  total: number;
  page: number;
  size: number;
}
//#endregion

//#region 최근검색
/**
 * 최근검색어 데이터
 */
interface RecentSearchModel {
  show: boolean;
  list: string[];
}
//#endregion

export type {
  SearchImageSortKey,
  SearchImageSort,
  SearchImageForm,
  SearchImagePagination,
  RecentSearchModel,
};

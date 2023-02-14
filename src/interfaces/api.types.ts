//#region 카카오 이미지 검색 api
/**
 * 카카오 이미지 response 화면 노출 데이터
 */
interface ImageResponse {
  collection: string;
  datetime: string;
  display_sitename: string;
  doc_url: string;
  width: number;
  height: number;
  image_url: string;
  thumbnail_url: string;
}

/**
 * 카카오 이미지 검색 response
 */
interface SearchImageResponse {
  documents: ImageResponse[];
  meta: {
    is_end: boolean;
    pageable_count: number;
    total_count: number;
  };
}
//#endregion

export type { ImageResponse, SearchImageResponse };

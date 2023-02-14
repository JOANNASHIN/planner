<template>
  <main class="search">
    <h1 class="blind">검색 페이지</h1>

    <!-- 상단 검색 form -->
    <header class="search__header">
      <SearchFormComponent
        v-model="form"
        @submit="handleSearch()"
      ></SearchFormComponent>
    </header>

    <!-- 하단 검색 결과 -->
    <section class="search__cont">
      <h2 class="blind">검색 결과 리스트</h2>

      <!-- 로딩 프로그래스바 -->
      <LoadingComponent
        v-if="fetches.search === FetchesState.Wait"
      ></LoadingComponent>

      <!-- 정상 케이스 -->
      <template v-if="fetches.search === FetchesState.Success">
        <InfiniteScrollComponent
          v-model="pagination"
          :process="process.more"
          @next="handleNextPage()"
          @retry="handleRetry()"
        >
          <ImageListComponent v-model="imageList"></ImageListComponent>
        </InfiniteScrollComponent>
      </template>

      <!-- 에러케이스 -->
      <ErrorComponent
        v-else-if="fetches.search === FetchesState.Error"
        @retry="handleRetry()"
      >
      </ErrorComponent>
    </section>
  </main>
</template>

<script lang="ts" setup>
  //#region component
  import LoadingComponent from '@/components/layouts/Loading.vue';
  import ErrorComponent from '@/components/layouts/Error.vue';
  import SearchFormComponent from '@/components/modules/SearchForm.vue';
  import ImageListComponent from '@/components/parts/ImageList.vue';
  import InfiniteScrollComponent from '@/components/modules/InfiniteScroll.vue';
  //#endregion

  //#region import
  import { ref, reactive } from 'vue';
  import networkComposable from '@/services/network';
  import { ProcessState, FetchesState } from '@/interfaces/type';
  import type { Process, Fetches } from '@/interfaces/type';
  import type { SearchImageForm } from '@/interfaces/app.types';
  import type {
    ImageResponse,
    SearchImageResponse,
  } from '@/interfaces/api.types';
  //#endregion

  //#region network
  const { request } = networkComposable();
  //#endregion

  //#region fetches & process
  const fetches = reactive<Fetches>({
    search: 'success',
  });

  const process = reactive<Process>({
    more: 'success',
  });
  //#endregion

  //#region 이미지 리스트 / 검색
  /**
   * 이미지 데이터
   */
  const imageList = ref<ImageResponse[]>([]);

  /**
   * 검색 정보
   */
  const form = reactive<SearchImageForm>({
    query: '',
    sort: 'accuracy',
  });

  /**
   * 페이지네이션
   */
  const pagination = reactive({
    total: 0,
    page: 1,
    size: 10,
  });
  //#endregion

  //#region api연동
  /**
   * 카카오 이미지 api 연동
   */
  const fetchImages = async () => {
    const { query, sort } = form;
    const { page, size } = pagination;

    if (!query) return;

    if (
      fetches.search === FetchesState.Wait
      || process.search === ProcessState.Wait
    )
      return;

    try {
      if (pagination.page === 1) {
        fetches.search = 'wait';
      } else {
        process.more = 'wait';
      }

      const response: SearchImageResponse = await request({
        method: 'get',
        url: 'v2/search/image',
        data: {
          query,
          sort,
          page,
          size,
        },
      });

      const result = response?.documents ?? [];

      //페이지 네이션
      pagination.total = response.meta.total_count;

      if (page === 1) {
        imageList.value = result;
      } else {
        imageList.value = imageList.value.concat(result);
      }

      // fetches, process
      if (pagination.page === 1) {
        fetches.search = 'success';
      } else {
        process.more = 'success';
      }
    } catch (ex) {
      // 페이징 리셋
      pagination.page = pagination.page === 1 ? 1 : pagination.page - 1;

      //에러처리
      console.error(ex, 'getImages has exception');

      if (pagination.page === 1) {
        fetches.search = 'error';
      } else {
        process.more = 'error';
      }
    }
  };
  //#endregion

  //#region 검색
  /**
   * 검색 event
   */
  const handleSearch = async () => {
    // 페이지 리셋
    pagination.page = 1;
    await fetchImages();
  };
  //#endregion

  //#region 페이지네이션
  /**
   * 다음페이지 호출 event
   */
  const handleNextPage = async () => {
    if (process.more === ProcessState.Wait) return;
    pagination.page += 1;
    await fetchImages();
  };

  /**
   * 페이지네이션 오류 재시도 event
   */
  const handleRetry = async () => {
    await fetchImages();
  };
  //#endregion
</script>

<style scoped lang="scss">
  .search {
    min-width: rem(320px);
    max-width: rem(600px);
    margin: 0 auto;
    padding: rem(16px 12px 0);

    &__cont {
      padding: rem(30px 0 80px);
    }
  }
</style>

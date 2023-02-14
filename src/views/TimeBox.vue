<template>
  <main class="search">
    <h1>타임박스 페이지</h1>

    <span>
      <em>날짜:</em>
      <label for="">
        <input type="date">
      </label>
    </span>

    <dl>
      <dt>
        가장 중요한 3가지
      </dt>
      <dd>
        <ol>
          <li>
            <input type="text">
          </li>
          <li>
            <input type="text">
          </li>
          <li>
            <input type="text">
          </li>
        </ol>
      </dd>
    </dl>
    <dl>
      <dt>
        브레인 덤프 - 쏟아내기
      </dt>
      <dd>
        <textarea name="" id="" cols="30" rows="10"></textarea>
      </dd>
    </dl>
    
    <dl>
      <dt>
        브레인 덤프 - 쏟아내기
      </dt>
      <dd>
        <textarea name="" id="" cols="30" rows="10"></textarea>
      </dd>
    </dl>
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

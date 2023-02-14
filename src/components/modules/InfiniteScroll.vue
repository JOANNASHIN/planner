<template>
  <!-- 무한스크롤 컴포넌트 -->
  <div
    ref="refScrollContainer"
    class="infinite-scroll"
  >
    <!-- 리스트 -->
    <slot></slot>

    <!-- 로딩 프로그래스바 -->
    <LoadingComponent v-if="process === ProcessState.Wait"></LoadingComponent>

    <ErrorComponent
      v-else-if="process === ProcessState.Error"
      @retry="handleRetry()"
    >
    </ErrorComponent>
  </div>
</template>

<script lang="ts" setup>
  //#region component
  import LoadingComponent from '@/components/layouts/Loading.vue';
  import ErrorComponent from '@/components/layouts/Error.vue';
  //#endregion

  //#region import
  import { PropType, computed, ref, onMounted, onUnmounted } from 'vue';
  import { ProcessState } from '@/interfaces/type';
  import type { ProcessStateKey } from '@/interfaces/type';
  import type { SearchImagePagination } from '@/interfaces/app.types';
  //#endregion

  //#region emits & props
  interface Props {
    modelValue: SearchImagePagination;
    process: ProcessStateKey;
  }

  const emit = defineEmits<{
    (e: 'next'): void,
    (e: 'retry'): void
  }>();
  
  const props = defineProps({
    modelValue: {
      type: Object as PropType<Props['modelValue']>,
      required: true,
    },

    process: {
      type: String as PropType<Props['process']>,
      required: true,
    },
  });
  //#endregion

  //#region 무한스크롤 기능
  const pagination = computed(() => props.modelValue);

  /**
   * 마지막 페이지 여부
   */
  const isLastPage = computed(() => {
    const { page, size, total } = pagination.value;
    return page * size < total;
  });

  /**
   * 다음페이지 호출 event
   */
  const handleNextPage = async () => {
    emit('next');
  };

  /**
   * 페이지네이션 오류 재시도 event
   */
  const handleRetry = async () => {
    emit('retry');
  };

  /**
   * 무한 스크롤 대상 element
   */
  const refScrollContainer = ref<InstanceType<typeof HTMLElement>>();

  /**
   * 무한 스크롤 event
   */
  const handleScroll = () => {
    let element = refScrollContainer.value;
    if (!element) return;

    // 스크롤 위치 하단인지 체크
    const isBottom =
      element.getBoundingClientRect().bottom < window.innerHeight;

    // 최하단 && 페이지네이션 total 마지막이면
    if (isBottom && isLastPage.value) {
      handleNextPage();
    }
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  //#endregion
</script>

<template>
  <form
    class="search-form"
    @submit.prevent="handleSubmit()"
  >
    <div
      tabindex="-1"
      ref="refFormContainer"
      @focusout="handleFocuLose($event, refFormContainer)"
    >
      <div class="search-form__input-area">
        <input
          type="text"
          v-model.trim="form.query"
          class="search-form__input"
          placeholder="검색어를 입력하세요"
          maxlength="1000"
          @input="handleSearchInput($event)"
          @focus="showRecentSearchLayer(true)"
        />

        <button
          type="submit"
          class="search-form__submit"
        >
          검색버튼
        </button>
      </div>

      <!-- 최근 검색 레이어 -->
      <RecentSearchComponent
        v-show="recentSearch.show"
        class="search-form__layer"
        v-model="recentSearch.list"
      ></RecentSearchComponent>
    </div>

    <!-- 정렬 조건 -->
    <div class="search-form__sort">
      <label
        v-for="sort in sortList"
        :key="sort.value"
        class="sort__radio"
      >
        <input
          type="radio"
          v-model="form.sort"
          :value="sort.value"
          class="sort__input"
        />
        <span class="sort__name">{{ sort.name }}</span>
      </label>
    </div>
  </form>
</template>

<script lang="ts" setup>
  //#region component
  import RecentSearchComponent from '@/components/parts/RecentSearch.vue';
  //#endregion

  //#region import
  import { PropType, computed, ref, reactive } from 'vue';
  import type {
    SearchImageForm,
    SearchImageSort,
    RecentSearchModel,
  } from '@/interfaces/app.types';
  //#endregion

  //#region emits & props
  interface Props {
    modelValue: SearchImageForm;
  }

  const emit = defineEmits<{
    (e: 'update:modelValue', data: SearchImageForm): void,
    (e: 'submit'): void
  }>();

  const props = defineProps({
    modelValue: {
      type: Object as PropType<Props['modelValue']>,
      required: true,
    },
  });
  //#endregion

  //#region 검색
  const form = computed({
    get: () => {
      return props.modelValue;
    },
    set: (newValue) => {
      emit('update:modelValue', {
        ...newValue,
        query: newValue.query.trim(),
      });
    },
  });

  /**
   * 정렬 리스트
   */
  const sortList = ref<SearchImageSort[]>([
    {
      value: 'accuracy',
      name: '정확도순',
    },
    {
      value: 'recency',
      name: '최신순',
    },
  ]);

  const handleSearchInput = (e: Event) => {
    const target = (e.target) as HTMLInputElement;
    target.value = target.value.toString().replace(/[^0-9a-zA-Zㄱ-힇\?\.]/, '');
  }

  /**
   * 최근 검색어 레이어 관련 데이터
   */
  const recentSearch = reactive<RecentSearchModel>({
    show: false,
    list: [],
  });

  /**
   * 자식을 포함하여 포커스를 잃었는지 반환
   *
   * @param e Focus Event
   * @param linkedElement 연계된 Element
   */
  const isLoseFocus = (e: FocusEvent, linkedElement?: Element) => {
    const root = e.currentTarget as HTMLElement;
    const related = e.relatedTarget as HTMLElement;
    const target = e.target as HTMLElement;

    return !(
      // 연계된 요소가 있는 경우 연계된 요소 활성화 여부 체크
      (
        (linkedElement &&
          (linkedElement.contains(related) ||
            related?.contains(linkedElement))) ||
        // 연계된 요소가 활성화 된게 아니거나, 그 외의 상황
        (root.contains(related) && root.contains(target))
      )
    );
  };

  /**
   * 옵션 레이어 ref
   */
  const refFormContainer = ref<HTMLElement | undefined>();

  /**
   * focus 잃었을때 다른 select 닫기
   */
  const handleFocuLose = (e: FocusEvent, linkedElement?: Element): void => {
    const hasFocus = !isLoseFocus(e, linkedElement);
    if (!hasFocus) showRecentSearchLayer(false);
  };

  /**
   * 검색 input focus event
   */
  const showRecentSearchLayer = (isShow: boolean) => {
    recentSearch.show = isShow;
  };

  /**
   * 최근 검색어 업데이트
   */
  const updateRecentSearch = () => {
    const prev = [...recentSearch.list];

    const mergeWords = form.value.query
      ? new Set([form.value.query, ...prev])
      : prev;
    const newValue = [...mergeWords];

    // 리스트 업데이트
    recentSearch.list = newValue;
  };

  /**
   * 검색 event
   */
  const handleSubmit = async () => {
    if (form.value.query === '') {
      alert('검색어를 입력하세요.');
      return;
    }
    // 최근 검색어 업데이트
    updateRecentSearch();

    // 최근 검색어 레이어 비노출 처리 (enter 케이스)
    recentSearch.show = false;

    emit('submit');
  };
  //#endregion
</script>

<style scoped lang="scss">
  $inputHeight: rem(40px);

  .search-form {
    position: relative;

    &__input-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: $bgGrey;
      border: 1px solid $borderGrey;
      border-radius: rem(4px);
    }

    &__input {
      flex: 1 1 auto;
      height: $inputHeight;
      padding: rem(0 10px);
      background: none;
      border: none;
      @include fontcss($black, 400, rem(13px));
    }

    &__submit {
      flex: rem(0 0 30px);
      height: rem(30px);
      margin: rem(0 10px);
      background: url(src('common', 'search-icon.png')) no-repeat center center / rem(20px);
      border: none;
      font-size: 0;
    }

    &__layer {
      position: absolute;
      top: calc($inputHeight + #{rem(2px)});
      left: 0;
      z-index: 10;
    }

    &__sort {
      margin-top: rem(16px);

      .sort {
        &__radio {
          display: inline-block;
          margin-right: rem(8px);
          font-size: 0;
        }

        &__input {
          display: none;

          &:checked + .sort__name {
            border-color: $red;
            color: $red;
            font-weight: 600;
          }
        }

        &__name {
          display: inline-block;
          padding: rem(6px 14px);
          border: 1px solid $borderGrey;
          border-radius: rem(20px);
          vertical-align: middle;
          @include fontcss($textGrey, 400, rem(12px), 1.4);
        }
      }
    }
  }
</style>

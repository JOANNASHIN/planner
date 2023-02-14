<template>
  <div class="error">
    <slot name="content">
      <div class="error__text">
        <slot name="text">
          <p>오류가 발생하였습니다.</p>
        </slot>
      </div>

      <slot name="button">
        <button
          class="error__retry"
          @click="handleRetry()"
        >
          재시도
        </button>
      </slot>
    </slot>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    (e: 'retry'): void
  }>();

  function handleRetry() {
    emit('retry')
  }
</script>

<style lang="scss" scoped>
  .error {
    width: 100%;
    padding: rem(100px 0);
    text-align: center;

    &__text {
      @include fontcss($textGrey, 400, rem(14px));
    }

    &__retry {
      display: inline-block;
      margin-top: rem(8px);
      padding: rem(4px 20px);
      background: $white;
      border: 1px solid $borderGrey;
      @include fontcss($textGrey, 400, rem(12px));
    }
  }
</style>

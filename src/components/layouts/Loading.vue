<template>
  <span class="loading"> loading... </span>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
  .loading {
    position: fixed !important;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.6);
    font-size: 0;

    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: rem(72px);
      height: rem(72px);
      background: url(src('common', 'loading.gif')) no-repeat center center / 100% auto;
      border-radius: 5px;
      transform: translate(-50%, -50%);
    }
  }
</style>

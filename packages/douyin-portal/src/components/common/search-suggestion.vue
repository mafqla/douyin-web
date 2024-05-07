<script setup lang="ts">
import {} from 'vue'

defineProps({
  relatedText: String
})
</script>
<template>
  <span class="search-suggestion-container">
    <span class="suggestion-text-content">
      <a class="suggestion-link" href="#">
        <span class="suggestion-text">{{ relatedText }}</span>
        <svg
          width="9"
          height="9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="suggestion-search-icon"
          viewBox="0 0 9 9"
        >
          <path
            clip-rule="evenodd"
            d="M1.2 4.024c0-1.375 1.05-2.426 2.426-2.426 1.217 0 2.269 1.051 2.269 2.426 0 1.218-1.051 2.269-2.27 2.269-1.374 0-2.425-1.051-2.425-2.269zM3.626.398C1.588.398 0 1.987 0 4.024 0 5.96 1.645 7.493 3.626 7.493c.729 0 1.414-.239 1.98-.64l1.57 1.57a.6.6 0 00.848-.85l-1.57-1.57c.402-.565.64-1.25.64-1.979 0-1.98-1.533-3.626-3.468-3.626z"
          ></path>
        </svg>
      </a>
    </span>
  </span>
</template>

<style lang="scss" scoped>
.search-suggestion-container {
  overflow: hidden;
}

.suggestion-text-content {
  display: flex;
  overflow: hidden;
  color: var(--color-text-t1);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.suggestion-link {
  cursor: pointer;
  text-decoration: none;
  position: relative;
  display: flex;
  overflow: hidden;
}

.suggestion-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  overflow: hidden;
  color: var(--search-text-color);
}
.suggestion-search-icon {
  fill: var(--search-text-color);
  width: 9px;
  height: 9px;
  vertical-align: super;
  margin: 0 2px;
  position: relative;
  top: 2px;
  flex-shrink: 0;
}
</style>

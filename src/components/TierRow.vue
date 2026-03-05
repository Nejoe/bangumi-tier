<script setup lang="ts">
import draggable from 'vuedraggable'
const list1 = ref([
  { name: 'John', id: 1 },
  { name: 'Joao', id: 2 },
  { name: 'Jean', id: 3 },
  { name: 'Gerard', id: 4 }
])
function log(evt: Event) {
  window.console.log(evt)
}
</script>
<template>
  <draggable class="list-group" :list="list1" group="people" @change="log" itemKey="name">
    <template #item="{ element, index }">
      <div class="list-group-item">{{ element.name }} {{ index }}</div>
    </template>
  </draggable>
</template>

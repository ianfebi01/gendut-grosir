<template>
  <div class="wrapper">
    <div class="box"></div>
    <div class="box2"></div>
    <div class="box"></div>
    <div class="box4"></div>
    <div class="box"></div>
    <div class="box5"></div>
    <div class="box"></div>
    <div class="box3"></div>
    <div class="box4"></div>
    <div class="box2"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box5"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box2"></div>
    <div class="box"></div>
    <div class="box3"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box4"></div>
  </div>
</template>

<script>
export default {
  name: 'Masonry',
  layout: 'dashboard',
}
</script>
<style lang="scss" scoped>
@use '@/assets/scss/abstracts/variables.scss' as v;

.wrapper {
  max-width: 1200px;
  margin: 0px auto;
  columns: 4;
  column-gap: 10px;
}
.box {
  content: '';
  width: 250px;
  height: 400px;
  background: v.$primary;
  margin-bottom: 10px;
  break-inside: avoid;
}
.box2 {
  content: '';
  width: 250px;
  height: 250px;
  background: v.$primary;
  margin-bottom: 10px;
  break-inside: avoid;
}
.box3 {
  content: '';
  width: 250px;
  height: 100px;
  background: v.$primary;
  margin-bottom: 10px;
  break-inside: avoid;
}
.box4 {
  content: '';
  width: 250px;
  height: 250px;
  background: v.$primary;
  margin-bottom: 10px;
  break-inside: avoid;
}
.box5 {
  content: '';
  width: 250px;
  height: 350px;
  background: v.$primary;
  margin-bottom: 10px;
  break-inside: avoid;
}
</style>

<template>
  <tr>
    <th scope="row">{{ index + 1 }}</th>
    <td>{{ dateCollected | moment("dddd, Do MMMM YYYY") }}</td>
    <td>{{ kills }}</td>
    <td>{{ score }}</td>
  </tr>
</template>

<script>
  export default {
    props: {
      kills: Number,
      score: Number,
      index: Number,
      dateCollected: String
    },
  };
</script>

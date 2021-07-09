<template>
  <div>
    <NetworkChart
      width="100%"
      height="100vh"
    />
  </div>
</template>

<script>
import NetworkChart from "@/components/Charts/NetworkChart";

export default {
  name: "CoreComponents",
  components: {
    NetworkChart,
  },
};
</script>


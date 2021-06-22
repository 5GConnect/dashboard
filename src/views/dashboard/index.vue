<template>
  <div class="dashboard-container">
    <UEInformationCard
      v-for="(activeUEInformation, ueSupi) in activeUEsInformations"
      :key="ueSupi"
      :gnbConnected="activeUEInformation.gnbConnected"
      :gnbCampedCell="activeUEInformation.gnbCampedCell"
      :subscriptionInfo="activeUEInformation.subscriptionInfo"
      :PDUs="activeUEInformation.PDUs"
      :ueSupi="ueSupi"
      :ueUrl="activeUEInformation.url"
    />
  </div>
</template>

<script>
import UEInformationCard from "@/components/UEInformationCard";

export default {
  name: "Dashboard",
  computed: {
    activeUEsInformations() {
      return this.$store.state.activeUEs.data;
    }
  },
  components: {
    UEInformationCard,
  },
  methods: {},
  created() {
    this.$store.dispatch("activeUEs/getUEs");
  },
};
</script>


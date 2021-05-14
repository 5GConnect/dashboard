<template>
  <div class="dashboard-container">
    <el-main>

      <el-badge is-dot class="item" :type="gnbConnected ? 'success' : 'danger'" v-for="o in 10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>UE IP: {{ue_ip}}</span>
            <span style="float: right; padding: 0px 0px 0px 15px" type="text">gNB{{gnb_camped_cell}}</span>
          </div>
        </el-card>
      </el-badge>

    </el-main>
  </div>
</template>

<script>
import { getRequirements } from "@/api/UEDigitalEntity";

export default {
  name: "Dashboard",
  computed: {

  },
  data() {
    return {
      gnbConnected: false,
      ue_ip: "192.168.0.1",
      gnb_camped_cell: "campedAAA"

    };
  },
  methods: {
    fetchData() {
      getRequirements()
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        });

    },
  },
  mounted() {
    this.fetchData()
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}

</style>

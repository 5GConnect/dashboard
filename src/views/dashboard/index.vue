<template>
  <div class="dashboard-container">
    <el-main>
      <el-dialog
        title="Enstablish a new PDU session"
        :visible.sync="dialogVisible"
        width="60%"
      >
        <el-table
          :data="displayableNSSAIs"
          ref="nssaiTable"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="sst" label="SST" width="55"> </el-table-column>
          <el-table-column prop="sd" label="SD" width="75"> </el-table-column>
          <el-table-column prop="apn" label="APN"></el-table-column>
          <el-table-column
            width="75"
            prop="defaultPduSession"
            label="TYPE"
          ></el-table-column>
          <el-table-column prop="5qi" label="5QI" width="55"></el-table-column>
          <el-table-column prop="arp" label="ARP PRIORITY"></el-table-column>
          <el-table-column
            prop="capability"
            label="CAPABILITY"
          ></el-table-column>
          <el-table-column
            prop="vulnerability"
            label="VULNERABILITY"
          ></el-table-column>
          <el-table-column
            prop="sessionAmbrDownlink"
            label="SESSION AMBR DL"
          ></el-table-column>
          <el-table-column
            prop="sessionAmbrUplink"
            label="SESSION AMBR UL"
          ></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCloseDialog">Close</el-button>
          <el-button type="primary" @click="createPDUsession">Create</el-button>
        </span>
      </el-dialog>

      <el-badge is-dot class="item" :type="gnbConnected ? 'success' : 'danger'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h2>IMSI-900000000</h2>
          </div>
          <div>
            <h2>UE informations</h2>
            <el-row>
              <el-col :span="10"
                ><span><b>Connected gNB ID: </b></span>
              </el-col>
              <el-col :span="14">
                <span>{{ gnbCampedCell }}</span></el-col
              >
            </el-row>
            <br />
            <el-row v-if="subscriptionInfo.subscribedUeAmbr">
              <el-col :span="10"
                ><span><b>UE AMBR: </b></span>
              </el-col>
              <el-col :span="14">
                <font-awesome-icon icon="upload" class="el-icon upload" /><span
                  style="margin-right: 12px"
                >
                  {{ subscriptionInfo.subscribedUeAmbr.uplink }}
                </span>
                <font-awesome-icon
                  icon="download"
                  class="el-icon download"
                /><span>
                  {{ subscriptionInfo.subscribedUeAmbr.downlink }}
                </span>
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <div v-if="PDUs.length > 0">
              <h2>Established PDU sessions</h2>
              <div class="established-pdu-container">
                <el-card
                  v-for="elem in PDUs"
                  :key="elem.id"
                  class="established-pdu-card"
                >
                  <el-row :gutter="5">
                    <el-col :span="8"
                      ><div class="grid-content bg-purple">
                        <b>id: </b>{{ elem.id }}
                      </div></el-col
                    >
                    <el-col :span="8"
                      ><div class="grid-content bg-purple">
                        <b>sd: </b>{{ elem.sd }}
                      </div></el-col
                    >
                    <el-col :span="8"
                      ><div class="grid-content bg-purple">
                        <b>sst: </b>{{ elem.sst }}
                      </div></el-col
                    >
                  </el-row>
                  <el-row :gutter="5">
                    <el-col :span="8"
                      ><div class="grid-content bg-purple">
                        <b>dnn: </b>{{ elem.dnn }}
                      </div></el-col
                    >
                    <el-col :span="8"
                      ><div class="grid-content bg-purple">
                        <b>type: </b>{{ elem.pduSessionType }}
                      </div></el-col
                    >
                    <el-col :span="8"
                      ><div class="grid-content bg-purple">
                        <b>ip: </b>{{ elem.ipAddress.ipv4Addr }}
                      </div></el-col
                    >
                  </el-row>
                </el-card>
              </div>
            </div>
            <el-button
              type="primary"
              circle
              @click="dialogVisible = true"
              id="nsButton"
            >
              <font-awesome-icon icon="link" class="el-icon link" />
            </el-button>
          </div>
        </el-card>
      </el-badge>
    </el-main>
  </div>
</template>

<script>
import {
  getGNBConnectionState,
  getRequirements,
  getSubscriptionInfo,
  postPDUsession,
  getPDUsession,
} from "@/api/UEDigitalEntity";

export default {
  name: "Dashboard",
  data() {
    return {
      dialogVisible: false,
      gnbConnected: false,
      PDUs: [],
      selectedNSSAIs: [],
      gnbCampedCell: "",
      subscriptionInfo: {},
    };
  },
  computed: {
    displayableNSSAIs: function () {
      if (this.subscriptionInfo.nssai) {
        let displayableNSSAIs = filterAndFlattenNssai(
          this.subscriptionInfo.nssai.defaultSingleNssais.concat(
            this.subscriptionInfo.nssai.singleNssais
          )
        );
        return displayableNSSAIs;
      } else {
        return {};
      }
    },
  },
  methods: {
    fetchData: function () {
      let that = this;
      getPDUsession()
        .then(function (response) {
          that.PDUs = response;
        })
        .catch(function (error) {
          console.log(error);
        });

      getSubscriptionInfo()
        .then(function (response) {
          that.subscriptionInfo = response;
        })
        .catch(function (error) {
          console.log(error);
        });

      getGNBConnectionState()
        .then(function (response) {
          if (response.status == "CM-CONNECTED") {
            that.gnbConnected = true;
            that.gnbCampedCell = response["camped-cell"];
          } else if (esponse.status == "CM-IDLE") {
            that.gnbConnected = false;
            that.gnbCampedCell = "camped-cell";
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    createPDUsession: function () {
      let that = this;
      if (this.selectedNSSAIs.length > 0) {
        let promises = this.selectedNSSAIs.map((selectedNSSAI) =>
          postPDUsession({
            sst: selectedNSSAI.sst,
            sd: selectedNSSAI.sd,
            dnn: selectedNSSAI.apn,
            pduSessionType: "IPV4", //selectedNSSAI.defaultPduSession
          })
        );
        Promise.allSettled(promises).then((results) => {
          if (
            results.every((resultObject) => resultObject.status === "fulfilled")
          ) {
            this.$notify({
              title: "Success.",
              message:
                "All PDU sessions has been created",
              type: "success",
            });
            results
              .map((resultObject) => resultObject.value)
              .forEach(function (value, i) {
                //TODO: allSettled should preserve order, check needed
                let nssai = that.selectedNSSAIs[i];
                // Technical Debt: We do not need to check pdu session with status command, but with SMF API (event subscriptio).
                //The API is not available in O5GS already.
                if (that.PDUs.every((pdu) => pdu.id !== value.id)) {
                  that.PDUs.push({
                    sst: nssai.sst,
                    sd: nssai.sd,
                    dnn: nssai.apn,
                    pduSessionType: "IPV4", //selectedNSSAI.defaultPduSession
                    ipAddress: value.ipAddress,
                    emergency: value.emergency,
                    id: value.id,
                  });
                }
              });
            this.handleCloseDialog();
          } else {
            this.$notify({
              title: "Error.",
              message:
                "Something went wrong. Not all PDU sessions has been created",
              type: "error",
            });
            this.handleCloseDialog();
          }
        });
      } else {
        this.$notify({
          title: "Warning.",
          message: "You must select at least one NSSAI",
          type: "warning",
        });
      }
    },
    handleSelectionChange(tableSelection) {
      this.selectedNSSAIs = tableSelection;
    },
    handleCloseDialog() {
      this.dialogVisible = false;
      this.selectedNSSAIs = [];
      this.$refs.nssaiTable.clearSelection();
    },
  },
  mounted() {
    this.fetchData();
  },
};
function filterAndFlattenDnnConfiguration(dnnConfigurationObject) {
  let res = [];
  for (const [key, value] of Object.entries(dnnConfigurationObject)) {
    let qosProfile = value["5gQosProfile"];
    res.push({
      apn: key,
      defaultPduSession: value.pduSessionTypes.defaultSessionType,
      "5qi": qosProfile["5qi"],
      arp: qosProfile.priorityLevel,
      capability: qosProfile.arp.preemptCap,
      vulnerability: qosProfile.arp.preemptVuln,
      sessionAmbrDownlink: value.sessionAmbr.downlink,
      sessionAmbrUplink: value.sessionAmbr.uplink,
    });
  }
  return res;
}
function filterAndFlattenNssai(nssaiList) {
  return nssaiList.flatMap((element) =>
    filterAndFlattenDnnConfiguration(
      element.dnnConfigurations
    ).map((filteredAndFlattenedDnnConfigurations) =>
      Object.assign(
        { sst: element.sst, sd: element.sd },
        filteredAndFlattenedDnnConfigurations
      )
    )
  );
}
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

.box-card {
  width: 25vw;
  padding: 20px;
}

.download {
  color: firebrick;
}

.upload {
  color: green;
}

.link {
  color: white;
}

#nsButton {
  animation-name: pulse;
  animation-duration: 8s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  float: right;
  margin: 10x;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(102, 177, 255, 0.7);
  }

  15% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(102, 177, 255, 0);
  }

  30% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(102, 177, 255, 0);
  }
}
div.cell {
  text-align: center !important;
}
.established-pdu-card {
  margin-bottom: 5px;
  height: 8vh;
}
.established-pdu-container {
  height: 17vh;
  overflow-y: auto;
  margin-bottom: 20px;
}
</style>

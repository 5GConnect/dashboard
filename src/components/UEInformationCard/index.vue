<template>
  <el-main>
    <el-dialog
      title="Enstablish a new PDU session"
      :visible.sync="pduDialogVisible"
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
        <el-table-column prop="capability" label="CAPABILITY"></el-table-column>
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
      <el-row :gutter="7" style="margin-top:10px">
        <el-col :span="4">
          <div class="grid-content">
              <el-input
                placeholder="Endpoint IP"
                v-model="endPointIp"
                validate-event
                clearable
                maxlength="15">
              </el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content">
              <el-input
                placeholder="Port"
                v-model="endPointPort"
                validate-event
                clearable
                maxlength="5">
              </el-input>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClosePduDialog">Close</el-button>
        <el-button type="primary" @click="createPDUsession">Create</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Select UE requirments"
      :visible.sync="requirmentsDialogVisible"
      width="60%"
    >
      <el-table
        :data="requirments"
        ref="requirmentsTable"
        style="width: 100%"
        highlight-current-row
        @current-change="handleRequirmentChange"
      >
        <el-table-column prop="name"> </el-table-column>
      </el-table>
      <el-row :gutter="7" style="margin-top:10px">
        <el-col :span="4">
          <div class="grid-content">
              <el-input
                placeholder="Endpoint IP"
                v-model="endPointIp"
                validate-event
                clearable
                maxlength="15">
              </el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content">
              <el-input
                placeholder="Port"
                v-model="endPointPort"
                validate-event
                clearable
                maxlength="5">
              </el-input>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseRequirmentsDialog">Close</el-button>
        <!-- <el-button type="primary" @click="createPDUsession">Create</el-button> -->
      </span>
    </el-dialog>

    <el-badge is-dot class="item" :type="gnbConnected ? 'success' : 'danger'">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h2>{{ ueSupi }}</h2>
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
                @click="openConsole(elem.id)"
              >
                <el-row
                  :gutter="5"
                  type="flex"
                  class="row-bg"
                  justify="space-between"
                >
                  <el-col :span="7"
                    ><div class="grid-content bg-purple">
                      <b>id: </b>{{ elem.id }}
                    </div></el-col
                  >
                  <el-col :span="7"
                    ><div class="grid-content bg-purple">
                      <b>sd: </b>{{ elem.sd }}
                    </div></el-col
                  >
                  <el-col :span="7"
                    ><div class="grid-content bg-purple">
                      <b>sst: </b>{{ elem.sst }}
                    </div></el-col
                  >
                </el-row>
                <el-row
                  :gutter="5"
                  type="flex"
                  class="row-bg"
                  justify="space-between"
                >
                  <el-col :span="7"
                    ><div class="grid-content bg-purple">
                      <b>dnn: </b>{{ elem.dnn }}
                    </div></el-col
                  >
                  <el-col :span="7"
                    ><div class="grid-content bg-purple">
                      <b>type: </b>{{ elem.pduSessionType }}
                    </div></el-col
                  >
                  <el-col :span="7"
                    ><div class="grid-content bg-purple">
                      <b>ip: </b>{{ elem.ipAddress.ipv4Addr }}
                    </div></el-col
                  >
                </el-row>
                <el-row :gutter="5" type="flex" class="row-bg" justify="end">
                  <el-col :span="3"
                    ><div class="grid-content bg-purple">
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        @click="removePDUsession(elem.id)"
                      ></el-button></div
                  ></el-col>
                  <el-col :span="3"
                    ><div class="grid-content bg-purple">
                      <el-button
                        type="primary"
                        icon="el-icon-s-promotion"
                        circle
                        @click="openConsole(elem.ipAddress.ipv4Addr)"
                      ></el-button></div
                  ></el-col>
                </el-row>
              </el-card>
            </div>
          </div>
          <el-button
            type="primary"
            circle
            @click="pduDialogVisible = true"
            id="nsButton"
          >
            <font-awesome-icon icon="link" class="el-icon link" />
          </el-button>
          <el-button
            type="primary"
            circle
            @click="requirmentsDialogVisible = true"
            id="nsButton"
          >
            <font-awesome-icon icon="scroll" class="el-icon link" />
          </el-button>
        </div>
      </el-card>
    </el-badge>
    <NetworkCommandConsole ref="console" :ueUrl="ueUrl" />
  </el-main>
</template>

<script>
import {
  postPDUsession,
  deletePDUsession,
  getPDUSessionByRequirement,
} from "@/api/UEDigitalEntity";
import NetworkCommandConsole from "@/components/NetworkCommandConsole";

export default {
  name: "UEInformationCard",
  props: [
    "gnbConnected",
    "gnbCampedCell",
    "subscriptionInfo",
    "PDUs",
    "ueSupi",
    "ueUrl",
  ],
  data() {
    return {
      selectedNSSAIs: [],
      endPointIp: "",
      endPointPort: 80,
      requirments: [
        { name: "HIGH_DOWNLINK_BANDWIDTH" },
        { name: "LOW_DOWNLINK_BANDWIDTH" },
      ],
      pduDialogVisible: false,
      requirmentsDialogVisible: false,
    };
  },
  components: {
    NetworkCommandConsole,
  },
  computed: {
    displayableNSSAIs() {
      return this.$store.getters.displayableNSSAIs(this.ueSupi);
    },
  },
  methods: {
    handleSelectionChange(tableSelection) {
      this.selectedNSSAIs = tableSelection;
    },
    handleClosePduDialog() {
      this.pduDialogVisible = false;
      this.selectedNSSAIs = [];
      this.endPointIp = ""
      this.endPointPort = 80
      this.$refs.nssaiTable.clearSelection();
    },
    handleCloseRequirmentsDialog() {
      this.requirmentsDialogVisible = false;
    },
    createPDUsession: function () {
      if(!this.validateIp(this.endPointIp) || !this.validatePort(this.endPointPort)) {
          this.$notify({
            title: "Warning.",
            message: "Invalid Ip address and port",
            type: "warning",
          });
      } else if (this.selectedNSSAIs.length <= 0) { 
          this.$notify({
            title: "Warning.",
            message: "You must select at least one NSSAI",
            type: "warning",
          });
      } else {
        let promises = this.selectedNSSAIs.map((selectedNSSAI) =>
          postPDUsession(this.ueUrl, {
            sst: selectedNSSAI.sst,
            sd: selectedNSSAI.sd,
            dnn: selectedNSSAI.apn,
            pduSessionType: "IPV4", //selectedNSSAI.defaultPduSession
            endPointIp: this.endPointIp,
            endPointPort: this.endPointPort
          })
        );
        Promise.allSettled(promises).then((results) => {
          if (
            results.every((resultObject) => resultObject.status === "fulfilled")
          ) {
            this.$notify({
              title: "Success.",
              message: "The creation of all PDU sessions has been triggered",
              type: "success",
            });
            this.handleClosePduDialog();
            setTimeout(
              () =>
                this.$store.dispatch(
                  "activeUEs/updatePduSessions",
                  this.ueSupi
                ),
              500
            );
          } else {
            this.$notify({
              title: "Error.",
              message:
                "Something went wrong. Not all PDU sessions will be created",
              type: "error",
            });
            this.handleClosePduDialog();
          }
        });
      }
    },
    handleRequirmentChange(selectedValue) {
      if(!this.validateIp(this.endPointIp) || !this.validatePort(this.endPointPort)) {
          this.$notify({
            title: "Warning.",
            message: "Invalid Ip address and port",
            type: "warning",
          });
      } else if (selectedValue) {
        getPDUSessionByRequirement(this.ueUrl, selectedValue.name, this.endPointIp, this.endPointPort)
          .then((result) => {
            let promises = this.PDUs.filter(
              (establishedPdu) => result.sst == establishedPdu.sst
            ).map((establishedPdu) => {
              deletePDUsession(this.ueUrl, establishedPdu.id);
            });
            Promise.allSettled(promises).then((results) => {
              if (
                results.every(
                  (resultObject) => resultObject.status === "fulfilled"
                )
              ) {
                postPDUsession(this.ueUrl, result)
                  .then((result) => {
                    this.$notify({
                      title: "Success.",
                      message: result,
                      type: "success",
                    });
                    setTimeout(
                      () =>
                        this.$store.dispatch(
                          "activeUEs/updatePduSessions",
                          this.ueSupi
                        ),
                      500
                    );
                  })
                  .catch(function (error) {
                    this.$notify({
                      title: "Error.",
                      message:
                        "Something went wrong. Cannot delete PDU session",
                      type: "error",
                    });
                  })
                  .finally(() => this.handleCloseRequirmentsDialog());
              } else {
                this.$notify({
                  title: "Error.",
                  message:
                    "Something went wrong. Unable to deleting exixting PDU session for the slice.",
                  type: "error",
                });
                this.handleCloseRequirmentsDialog();
              }
            });
          })
          .catch(function () {
            this.$notify({
              title: "Error.",
              message:
                "Something went wrong. Cannot get PDU session information by requirement",
              type: "error",
            });
          });
      }
    },
    removePDUsession: function (pdu_id) {
      deletePDUsession(this.ueUrl, pdu_id)
        .then((result) => {
          this.$notify({
            title: "Success.",
            message: result,
            type: "success",
          });
          this.$refs.requirmentsTable.setCurrentRow();
          setTimeout(
            () =>
              this.$store.dispatch("activeUEs/updatePduSessions", this.ueSupi),
            500
          );
        })
        .catch(function () {
          this.$notify({
            title: "Error.",
            message: "Something went wrong. Cannot delete PDU session",
            type: "error",
          });
        });
    },
    openConsole: function (sessionIp) {
      this.$refs.console.toggleConsole(sessionIp);
    },
    validatePort: function(port) {
      let regex = new RegExp('((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))')
      return regex.test(port)
    },
    validateIp: function(ip) {
      let regex = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')
      return regex.test(ip)
    }
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
  //height: 8vh;
}
.established-pdu-container {
  height: 17vh;
  overflow-y: auto;
  margin-bottom: 20px;
}
</style>

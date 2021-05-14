<template>
  <div class="dashboard-container">

    <el-main>

        <el-dialog
            title="Enstablish a new PDU session"
            :visible.sync="dialogVisible"
            width="60%">

            <table>
              <thead>
              <tr>
                <th>SST</th>
                <th>SD</th>
                <th>DNN/APN</th>
                <th>type<th>
                <th>5QI/QCI</th>
                <th>ARP</th>
                <th>Capability</th>
                <th>Vulnerability</th>
                <th>MBR DL/UL</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(elem, index) in subscriptionInfo.nssai.defaultSingleNssais.concat(subscriptionInfo.nssai.singleNssais)" :key="index">
                <td>{{elem.sst}}</td>
                <td>{{elem.sd}}</td>
                <td v-for="(el, index) in elem.dnnConfigurations" :key="index">{{index}}</td>
                <td>{{elem.dnnConfigurations['internet'].pduSessionTypes.defaultSessionType}}</td>
                <td>{{elem.dnnConfigurations['internet']['5gQosProfile']['5qi']}}</td>
                <td>{{elem.dnnConfigurations['internet']['5gQosProfile'].priorityLevel}}</td>
                <td>{{elem.dnnConfigurations['internet']['5gQosProfile'].arp.preemptCap}}</td>
                <td>{{elem.dnnConfigurations['internet']['5gQosProfile'].arp.preemptVuln}}</td>
                <td>{{elem.dnnConfigurations['internet'].sessionAmbr.downlink}}/{{elem.dnnConfigurations['internet'].sessionAmbr.uplink}}</td>
              </tr>
              </tbody>

            </table>


            <!-- print everything
            <div v-for="(elem, index) in subscriptionInfo.nssai.defaultSingleNssais.concat(subscriptionInfo.nssai.singleNssais)" :key="index">
              <span>sst: {{elem.sst}}</span>
              <span>sd: {{elem.sd}}</span>
              <span>dnnConfigurations.pduSessionTypes.defaultSessionType: {{elem.dnnConfigurations.pduSessionTypes.defaultSessionType}}</span>
              <span :key="index2" v-for="(i, index2) in elem.dnnConfigurations.pduSessionTypes.allowedSessionTypes">dnnConfigurations.pduSessionTypes.allowedSessionType: {{i}}</span>
              <span>dnnConfigurations.pduSessionTypes.defaultSscMode: {{elem.dnnConfigurations.defaultSscMode}}</span>
              <span :key="index2" v-for="(i, index2) in elem.dnnConfigurations.allowedSscModes">dnnConfigurations.allowedSscModes: {{i}}</span>

              <span>dnnConfigurations.elem.dnnConfigurations.5gQosProfile.5qi: {{elem.dnnConfigurations['5gQosProfile']['5qi']}}</span>
              <span>dnnConfigurations.elem.dnnConfigurations.5gQosProfile.priorityLevel: {{elem.dnnConfigurations['5gQosProfile'].priorityLevel}}</span>
              <span>dnnConfigurations.elem.dnnConfigurations.5gQosProfile.arp.preemptCap: {{elem.dnnConfigurations['5gQosProfile'].arp.preemptCap}}</span>
              <span>dnnConfigurations.elem.dnnConfigurations.5gQosProfile.arp.preemptVuln: {{elem.dnnConfigurations['5gQosProfile'].arp.preemptVuln}}</span>
              <span>dnnConfigurations.elem.dnnConfigurations.5gQosProfile.arp.priorityLevel: {{elem.dnnConfigurations['5gQosProfile'].arp.priorityLevel}}</span>
              <span>dnnConfigurations.sessionAmbr.uplink: {{elem.dnnConfigurations.sessionAmbr.uplink}}</span>
              <span>dnnConfigurations.sessionAmbr.downlink: {{elem.dnnConfigurations.sessionAmbr.downlink}}</span>
              <div :key="index2" v-for="(i, index2) in elem.dnnConfigurations.staticIpAddress">
                <span>dnnConfigurations.staticIpAddress.ipv4Addr: {{i.ipv4Addr}}</span>
                <span>dnnConfigurations.staticIpAddress.ipv6Addr: {{i.ipv6Addr}}</span>
                <span>dnnConfigurations.staticIpAddress.ipv6Prefix: {{i.ipv6Prefix}}</span>
              </div>
              <el-divider></el-divider>
            </div>
            -->

            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">Close</el-button>
              <el-button type="primary" @click="createPDUsession">Create</el-button>
            </span>
          </el-dialog>




      <el-badge is-dot class="item" :type="gnbConnected ? 'success' : 'danger'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>UE IP: {{ueIP}}</span>
            <span style="float: right; padding: 0px 0px 0px 15px" type="text">gNB{{gnbCampedCell}}</span>
            <div><i class="el-icon-upload2">{{subscriptionInfo.subscribedUeAmbr.uplink}} kbps</i> <i class="el-icon-download">{{subscriptionInfo.subscribedUeAmbr.downlink}}kbps</i></div>
          </div>
          <el-button type="primary" icon="el-icon-connection" circle @click="dialogVisible = true" style="float: right; margin: 10x"></el-button>
        </el-card>
      </el-badge>

    </el-main>
  </div>
</template>

<script>
import { getGNBConnectionState, getRequirements, getSubscriptionInfo, postPDUsession, getPDUsession} from "@/api/UEDigitalEntity";

export default {
  name: "Dashboard",
  computed: {

  },
  data() {
    return {
      dialogVisible: false,
      gnbConnected: false,
      ueIP: "192.168.x.x",
      gnbCampedCell: "camped-cell",
      subscriptionInfo: { //to be removed
                        "subscribedUeAmbr": {
                          "uplink": "50",
                          "downlink": "100"
                        },
                        "nssai": {
                          "defaultSingleNssais": [
                                {
                                    "sst": 1,
                                    "sd": "000001",
                                    "dnnConfigurations": {
                                        "internet": {
                                            "pduSessionTypes": {
                                                "defaultSessionType": "IPV4V6",
                                                "allowedSessionTypes": [
                                                    "IPV4",
                                                    "IPV6",
                                                    "IPV4V6"
                                                ]
                                            },
                                            "sscModes": {
                                                "defaultSscMode": "SSC_MODE_1",
                                                "allowedSscModes": [
                                                    "SSC_MODE_1",
                                                    "SSC_MODE_2",
                                                    "SSC_MODE_3"
                                                ]
                                            },
                                            "5gQosProfile": {
                                                "5qi": 9,
                                                "arp": {
                                                    "priorityLevel": 8,
                                                    "preemptCap": "NOT_PREEMPT",
                                                    "preemptVuln": "NOT_PREEMPTABLE"
                                                },
                                                "priorityLevel": 8
                                            },
                                            "sessionAmbr": {
                                                "uplink": "1024 Kbps",
                                                "downlink": "1024 Kbps"
                                            }
                                        }
                                    }
                                },
                                {
                                    "sst": 2,
                                    "sd": "000001",
                                    "dnnConfigurations": {
                                        "internet": {
                                            "pduSessionTypes": {
                                                "defaultSessionType": "IPV4V6",
                                                "allowedSessionTypes": [
                                                    "IPV4",
                                                    "IPV6",
                                                    "IPV4V6"
                                                ]
                                            },
                                            "sscModes": {
                                                "defaultSscMode": "SSC_MODE_1",
                                                "allowedSscModes": [
                                                    "SSC_MODE_1",
                                                    "SSC_MODE_2",
                                                    "SSC_MODE_3"
                                                ]
                                            },
                                            "5gQosProfile": {
                                                "5qi": 3,
                                                "arp": {
                                                    "priorityLevel": 1,
                                                    "preemptCap": "NOT_PREEMPT",
                                                    "preemptVuln": "NOT_PREEMPTABLE"
                                                },
                                                "priorityLevel": 1
                                            },
                                            "sessionAmbr": {
                                                "uplink": "1048576 Kbps",
                                                "downlink": "1048576 Kbps"
                                            }
                                        }
                                    }
                                }
                            ],
                            "singleNssais": []
                        }
                      }
    };
  },
  methods: {
    fetchData: function() {
      getSubscriptionInfo()
        .then(function (response) {
          subscriptionInfo = response.data
        })
        .catch(function (error) {
          console.log(error)
        });

        getGNBConnectionState()
        .then(function (response) {
          if(response.data.status == "gNB_CONNECTED") gnbConnected = true
          campedCell = response.data.camped-cell
        })
        .catch(function (error) {
          console.log(error)
        })

    },
    createPDUsession: function() {//take parameters from the selected nssai
      console.log('called: createPDU session')
      postPDUsession({
        "sst": 1,
        "sd": "000001",
        "dnn": "internet",
        "pduSessionTypes": "IPV4"
      }).then(function (response) {
          if(response.data.status == "gNB_CONNECTED") gnbConnected = true
          campedCell = response.data.camped-cell
        })
        .catch(function (error) {
          console.log(error)
        })
    }
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
.el-badge__content.is-dot {
  width: 16px !important;
  height: 16px !important;
}

</style>

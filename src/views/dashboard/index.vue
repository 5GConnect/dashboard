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
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">Close</el-button>
              <el-button type="primary" @click="createPDUsession">Create</el-button>
            </span>
          </el-dialog>




      <el-badge is-dot class="item" :type="gnbConnected ? 'success' : 'danger'">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>UE addr: {{PDUs[0].address.ipv4Addr}}</span>
            <span style="float: right; padding: 0px 0px 0px 15px" type="text">gNB{{gnbCampedCell}}</span>
            <div><i class="el-icon-upload2">{{subscriptionInfo.subscribedUeAmbr.uplink}} kbps</i> <i class="el-icon-download">{{subscriptionInfo.subscribedUeAmbr.downlink}}kbps</i></div>
          </div>

          <div v-for="elem in PDUs" :key="elem.id">
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">sd:{{elem.sd}}</div></el-col>
              <el-col :span="8"><div class="grid-content bg-purple">sst:{{elem.sst}}</div></el-col>
              <el-col :span="8"><div class="grid-content bg-purple">dnn:{{elem.dnn}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12"><div class="grid-content bg-purple">id:{{elem.id}}</div></el-col>
              <el-col :span="12"><div class="grid-content bg-purple">session types:{{elem.pduSessionTypes}}</div></el-col>
            </el-row>
            <el-divider></el-divider>
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
      PDUs: [
                  {
                    "sd": "sd",
                    "address": {
                      "ipv6Addr": "2001:db8:85a3::8a2e:370:7334",
                      "ipv4Addr": "198.51.100.1",
                      "ipv6Prefix": "2001:db8:abcd:12::0/64"
                    },
                    "sst": 153,
                    "dnn": "dnn",
                    "pduSessionTypes": "1",
                    "id": 0
                  }
                ],
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
      getPDUsession()
        .then(function (response) {
          PDUs = response.data
        })
        .catch(function (error) {
          console.log(error)
        });


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
        "sst": 2,
        "sd": "000001",
        "dnn": "internet",
        "pduSessionTypes": "IPV4"
      }).then(function (response) {
          this.$notify({
            title: 'Done.',
            message: 'PDU session created successfully',
            type: 'success'
          });
          this.dialogVisible = false
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

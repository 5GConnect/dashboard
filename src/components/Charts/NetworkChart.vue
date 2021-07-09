<template>
  <v-chart :style="{ height: height, width: width }" :option="chartOptions" />
</template>


<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GraphChart } from "echarts/charts";
import { TitleComponent, TooltipComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import resize from "./mixins/resize";

use([CanvasRenderer, GraphChart, TitleComponent, TooltipComponent]);

export default {
  mixins: [resize],
  components: {
    VChart,
  },
  props: {
    width: {
      type: String,
      default: "200px",
    },
    height: {
      type: String,
      default: "200px",
    },
  },
  data() {
    return {};
  },
  computed: {
    chartOptions() {
      let nodes = [];
      let links = [];
      nodes.push({
        name: "connection-point",
        symbol: "diamond",
      });
      for (const [key, value] of Object.entries(
        this.$store.state.coreComponents.data
      )) {
        nodes.push({
          name: value.instance,
          symbol: "circle",
          value: value.services,
          symbolSize: "20",
        });
        if (value.instanceStatus === "REGISTERED") {
          links.push({
            source: value.instance,
            target: "connection-point",
            value: `N${value.instance.toLowerCase()}`,
          });
        }
      }
      return {
        //backgroundColor: '#394056',
        title: {
          top: 20,
          text: "5GC components information",
          textStyle: {
            fontWeight: "normal",
            fontSize: 16,
            //color: '#F1F1F3'
          },
          left: "1%",
        },
         tooltip: {
          trigger: 'item',
          formatter: function (params) {
            console.log(JSON.stringify(params.value, null, 1).replace(/\n/g, "<br/>"))
            return JSON.stringify(params.value, null, 1).replace(/\n/g, "<br/>");
          },
         },
        series: [
          {
            name: "Component information",
            type: "graph",
            layout: "force",
            circular: {
              rotateLabel: true,
            },
            data: nodes,
            links: links,
            label: {
              position: "right",
              formatter: "{b}",
            },
            lineStyle: {
              color: "source",
              curveness: 0.3,
            },
            force: {
              repulsion: 9000,
              edgeLength: 150,
            },
          },
        ],
      };
    },
  },
  mounted() {
    this.$store.dispatch("coreComponents/getComponents");
  },
  methods: {},
};
</script>

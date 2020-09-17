<template>
  <div>
    <gov-heading size="l">View all reports</gov-heading>

    <ck-resource-listing-table
      ref="reportsTable"
      uri="/reports"
      :columns="[
        { heading: 'Type' },
        { heading: 'From' },
        { heading: 'To' },
        { heading: 'Date / Time' },
      ]"
      action-text="Download"
      @action="onDownload"
    >
      <template slot="cell:0" scope="{ resource: report }">
        {{ report.report_type }}
      </template>
      <template slot="cell:1" scope="{ resource: report }">
        {{ report.starts_at ? formatDate(report.starts_at) : 'N/A' }}
      </template>
      <template slot="cell:2" scope="{ resource: report }">
        {{ report.ends_at ? formatDate(report.ends_at) : 'N/A' }}
      </template>
      <template slot="cell:3" scope="{ resource: report }">
        {{ formatDateTime(report.created_at) }}
      </template>
    </ck-resource-listing-table>
  </div>
</template>

<script>
import http from "@/http";
import CkResourceListingTable from "@/components/Ck/CkResourceListingTable.vue";

export default {
  name: "ViewReportsPage",
  components: { CkResourceListingTable },
  methods: {
    async onDownload(report) {
      const file = await http.get(`/reports/${report.id}/download`);

      const regex = /filename[^;=\n]*=(?:(\\?['"])(.*?)\1|(?:[^\s]+'.*?')?([^;\n]*))/;
      const filename = regex.exec(
        file.request.getResponseHeader("Content-Disposition")
      )[2];
      const url = window.URL.createObjectURL(new Blob([file.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    }
  }
};
</script>

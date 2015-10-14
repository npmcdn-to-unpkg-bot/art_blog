$(document).ready(function() {
  $('table#posts-index').DataTable({
    "order" : [[ 0, "desc" ]],
    "pageLength" : 25,
    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
  });
});

let initializeDatatables = function(){
    mobilesuica_data = [
        [0,02,06,"繰",'','','',"9253",''],
        [1,02,07,"VIEW","モバイル",'','',"9753",500],
        [2,02,07,"入","東京","出","品川","9573",-180],
        [3,02,07,"入","品川","出","東京","9393",-180],
        [4,02,08,"物販",'','','',"9453",-440]
    ]
    // PDF出力の日本語対応のため
    pdfMake.fonts = {
        GenShin: {
          normal: 'GenShinGothic-Normal-Sub.ttf',
          bold: 'GenShinGothic-Normal-Sub.ttf',
          italics: 'GenShinGothic-Normal-Sub.ttf',
          bolditalics: 'GenShinGothic-Normal-Sub.ttf'
        }
    }
    table = $('#ms_usage_table').DataTable({
        // "Search"を"検索"にする等の日本語
        language: {
            url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json"
        },
        // 表示数のプルダウンメニュー
        lengthMenu: [[10,25,50,100,-1],[10,25,50,100,"全"]],
        data: mobilesuica_data,
        // ボタン配置
        dom: 'lBfrtip',
        buttons: [
         {
             extend: 'excelHtml5',
             text: 'EXCELファイルに出力',
             footer: true,
             filename: 'mobilesuica.xlsx',
             // チェックボックスの列は出力しない
             exportOptions: {
               columns: ':visible:not(:eq(0))' 
             }
         },
         {
             extend: 'csvHtml5',
             text: 'CSVファイルに出力',
             bom:true,
             footer: true,
             filename: 'mobilesuica.csv',
             exportOptions: {
               columns: ':visible:not(:eq(0))' 
             }
         },
         {
             extend: 'pdfHtml5',
             text: 'PDFファイルに出力',
             footer: true,
             filename: 'mobilesuica.pdf',
             customize: function ( doc ) {
               doc.defaultStyle.font= 'GenShin';
             },
             exportOptions: {
               columns: ':visible:not(:eq(0))' 
               }
         },
         {
             extend: 'copyHtml5',
             text: 'クリップボードにコピー',
             footer: true,
             filename: 'mobilesuica.html',
             exportOptions: {
               columns: ':visible:not(:eq(0))' 
             }
         },
         {
             extend: 'print',
             text: '印刷',
             footer: true,
             exportOptions: {
               columns: ':visible:not(:eq(0))' 
             },
         }
       ],
        'columnDefs': [
            {
                'targets': 0,
                'width': '10px',
                'searchable': false,
                'orderable': false,
                'render': function (data){
                    return '<input type="checkbox" name="o_chk" value="' + data + '">'
                }
            }
        ],
        // 2行目でまずソートしてから3行目で更にソート
        'order': [[1, 'asc'],[2, 'asc']]
    })
}

let all_select = function(){
    // table.rows().every()の後でthisが変わるため全選択のチェックボックスの状態を保持
    var that = this
    // 見えている全ての行に対しての操作
    table.rows(':visible').every(function() {
        // 各行の1列目(eq(0))=チェックボックスを全選択のチェックボックスと同じ状態にする
        $(this.node()).find('td').eq(0).find('input').prop('checked',that.checked)
        if(that.checked == true){
            // 全選択のチェックボックスがついた状態
            $(this.nodes()).addClass('selected')
        }else{
            // 全選択のチェックボックスがついてない状態（＝全解除）
            $(this.nodes()).removeClass('selected')
        }
    })
}
  
let ind_select = function(){
    var that = this
    var count = 0
    table.rows(':visible').every(function() {
        if($(this.node()).find('td').eq(0).find('input').prop('checked')){
            // チェックがついている行数をカウントする
            count += 1
            $(this.node()).addClass('selected')
        }else{
            $(this.node()).removeClass('selected')
        }
    })

    if(count == table.rows(':visible').count()){
        // チェックの行数 == 全行数なら全選択のチェックボックスにチェックをつける
        $('#all_checks').prop('checked', true)
    }else{
        // チェックの行数 != 全行数なら全選択のチェックボックスにチェックを外す
        $('#all_checks').prop('checked', false)
    }
}

let delete_row = function(){
    table.rows('.selected').remove().draw()
}

let calculate_sum = function(){
    var sum = table.column(8).data().reduce( function (a, b) {
        a = typeof a == 'number' ? a : 0
        b = typeof b == 'number' ? b : 0
        return a+b
    }, 0 )
    $(table.column(7).footer()).html('合計')
    $(table.column(8).footer()).html(sum)
    table.column(4).visible(false)
}
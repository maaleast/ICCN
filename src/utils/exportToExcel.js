import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';

const formatRupiahExcel = (number) => ({
  t: 'n', // Tipe data: number
  z: '"Rp"#,##0_-', // Format mata uang Rupiah
  v: number // Nilai angka
});

export const exportToExcel = (data, sheetName, fileName, options) => {
  try {
    // 1. Buat Workbook & Worksheet
    const wb = utils.book_new();

    // 2. Buat data untuk worksheet
    const wsData = [
      [`Laporan Keuangan ${options.type === 'bulanan' ? 'Bulanan' : 'Tahunan'}`],
      ["Deskripsi", "Status", "Tanggal", "Jumlah", "Saldo"],
      ...data.map(item => [
        item.deskripsi,
        item.status,
        item.tanggal,
        item.jumlah,
        item.saldo
      ]),
      ["", "", "TOTAL", 
       data.reduce((sum, item) => sum + item.jumlah, 0), 
       data[data.length - 1]?.saldo || 0]
    ];

    const ws = utils.aoa_to_sheet(wsData);

    // 3. Merge cell untuk judul
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } } // Merge row 0 dari kolom 0-4
    ];

    // 4. Format angka untuk kolom Jumlah dan Saldo
    const range = utils.decode_range(ws['!ref']);
    for (let R = 2; R <= range.e.r; R++) {
      for (let C = 3; C <= 4; C++) { // Kolom D dan E (index 3-4)
        const cell = utils.encode_cell({ c: C, r: R });
        if (ws[cell]) {
          // Pastikan nilai adalah angka
          if (typeof ws[cell].v === 'number') {
            ws[cell].z = formatRupiahExcel(ws[cell].v).z;
          }
        }
      }
    }

    // 5. Tambahkan worksheet ke workbook
    utils.book_append_sheet(wb, ws, sheetName || 'Sheet 1');

    // 6. Generate file Excel
    const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' });

    // 7. Buat blob dan unduh file
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // 8. Format nama file
    const fileNameWithDate = options.type === 'bulanan'
      ? `${fileName}_${options.year}${String(options.month).padStart(2, '0')}.xlsx`
      : `${fileName}_${options.year}.xlsx`;

    saveAs(blob, fileNameWithDate);

  } catch (error) {
    console.error('Error export:', error);
    throw error;
  }
};
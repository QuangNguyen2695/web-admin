import { Component, ElementRef, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { toast } from 'ngx-sonner';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-options-value',
  templateUrl: './options-value.component.html',
  styleUrl: './options-value.component.scss',
})
export class OptionsValueComponent implements OnInit {
  @ViewChild('cellInput', { static: false }) cellInput: ElementRef | undefined;

  rows: number = 11; // Number of rows in the matrix
  cols: number = 7; // Number of columns in the matrix
  matrix: {
    id: string;
    value: number;
    type: number;
    isEditing: boolean;
    isSelected: boolean;
    name: string;
    status: string;
    errorName: string;
    hasError: boolean;
    allowAutoNameEdit: boolean;
  }[][] = []; // Ma trận lưu giá trị, kiểu, trạng thái chỉnh sửa, trạng thái chọn, tên
  currentType: number = 1; // Kiểu hiện tại đang chọn
  usedNames: Set<number> = new Set(); // Danh sách lưu trữ các giá trị đã được sử dụng
  selectedMatrix: {
    id: string;
    value: number;
    type: number;
    name: string;
    status: string;
  }[][] = []; // Ma trận thứ hai lưu giá trị, kiểu, trạng thái chỉnh sửa, trạng thái chọn, tên và trạng thái của các ô được chọn
  originalName: string = '';
  holdTimeout: any;
  types = [
    {
      value: 1,
      label: 'Ghế',
      allowAutoNameEdit: true,
      icon: 'seat-available.svg',
      blockIcon: 'seat-block.svg',
      selectedIcon: 'seat-select',
    },
    { value: 2, label: 'Hành lang', allowAutoNameEdit: false, icon: 'street.svg' },
    { value: 3, label: 'Tài xế', allowAutoNameEdit: false, icon: 'driver.svg' },
  ];

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.initializeMatrix(); // Tạo ma trận 5x5

    ///temp second matrix
    this.selectedMatrix = Array.from({ length: this.rows }, (_, i) =>
      Array.from({ length: this.cols }, (_, j) => ({
        id: '',
        value: i * this.cols + j + 1,
        type: 0,
        name: '',
        icon: '',
        status: '',
      })),
    );
  }

  // Khởi tạo ma trận và trạng thái chọn
  // Khởi tạo ma trận và trạng thái chọn
  initializeMatrix(): void {
    this.matrix = Array.from({ length: this.rows }, (_, i) =>
      Array.from({ length: this.cols }, (_, j) => ({
        id: '',
        value: i * this.cols + j + 1,
        type: 0,
        isEditing: false,
        isSelected: false,
        name: '',
        icon: '',
        errorName: '',
        status: 'available',
        hasError: false,
        allowAutoNameEdit: false, // Thêm thuộc tính allowAutoNameEdit
        isDisappearing: false, // Thêm thuộc tính isDisappearing
      })),
    );
  }

  // Chọn kiểu (type)
  selectType(type: number): void {
    this.currentType = type;
  }

  // Áp dụng kiểu vào ô được chọn, không cho phép bỏ chọn khi đang chỉnh sửa
  applyType(row: number, col: number): void {
    const cell = this.matrix[row][col];
    const selectedType = this.types.find((type) => type.value === this.currentType);
    // Lưu trạng thái chỉnh sửa hiện tại trước khi áp dụng loại mới
    this.matrix.forEach((matrixRow, i) => matrixRow.forEach((cell, j) => cell.isEditing && this.saveEdit(i, j)));
    // Kiểm tra nếu ô đang chỉnh sửa hoặc có lỗi thì không làm gì
    if (cell.isEditing || this.hasError()) return;

    // Nếu ô đã được chọn và loại hiện tại giống với loại của ô, bỏ chọn ô
    if (cell.isSelected && cell.type === this.currentType) {
      cell.isSelected = false;
      this.usedNames.delete(parseInt(cell.name.slice(1))); // Xóa tên khỏi usedNames
      cell.type = 0;
      cell.name = '';
      cell.allowAutoNameEdit = false; // Cập nhật allowAutoNameEdit
      return;
    }

    // Nếu ô đã được chọn và loại hiện tại khác với loại của ô, áp dụng loại mới
    if (cell.isSelected && cell.type !== this.currentType) {
      this.updateCellType(cell, selectedType);
      return;
    }

    // Nếu ô đang là loại 1 và loại mới là 2 hoặc 3, xóa tên khỏi usedNames
    if (cell.type === 1 && [2, 3].includes(this.currentType)) {
      this.usedNames.delete(parseInt(cell.name.slice(1)));
    }

    // Lưu trạng thái chỉnh sửa hiện tại trước khi áp dụng loại mới
    this.matrix.forEach((matrixRow, i) => matrixRow.forEach((cell, j) => cell.isEditing && this.saveEdit(i, j)));

    // Nếu loại hiện tại hợp lệ, áp dụng loại mới cho ô
    if (this.currentType > 0) {
      this.updateCellType(cell, selectedType);
    }
  }

  updateCellType(cell: any, selectedType: any): void {
    cell.type = this.currentType; // Cập nhật loại của ô
    cell.isSelected = true; // Đánh dấu ô đã được chọn

    // Cập nhật allowAutoNameEdit theo loại
    cell.allowAutoNameEdit = selectedType?.allowAutoNameEdit || false;

    // Nếu loại là 2 hoặc 3, xóa tên của ô
    if ([2, 3].includes(this.currentType)) {
      cell.name = '';
    } else if (selectedType?.allowAutoNameEdit) {
      const maxNames = this.rows * this.cols;
      for (let i = 1; i <= maxNames; i++) {
        if (!this.usedNames.has(i)) {
          cell.name = `A${i.toString().padStart(2, '0')}`; // Tạo tên mới cho ô
          this.usedNames.add(i);
          break;
        }
      }
    }

    cell.icon = this.getIconByType(cell.type, cell.status); // Cập nhật icon cho ô
  }

  // Hàm focus vào ô đang chỉnh sửa
  focusCell(): void {
    console.log('🚀 ~ OptionsValueComponent ~ focusCell ~ focusCell:');
    setTimeout(() => {
      if (this.cellInput) {
        this.cellInput.nativeElement.focus();
      }
    }, 0);
  }

  // Bắt đầu nhấn chuột
  onMouseDown(row: number, col: number, event: MouseEvent): void {
    if (event.button !== 0) return; // Chỉ thực hiện nếu nhấn chuột trái
    event.preventDefault(); // Ngăn chặn hành động mặc định
    this.holdTimeout = setTimeout(() => {
      this.toggleStatus(row, col, event); // Thay đổi trạng thái khi nhấn giữ
      this.holdTimeout = null; // Đặt lại holdTimeout
    }, 1000); // Thời gian nhấn giữ là 1000ms
  }

  // Nhả chuột
  onMouseUp(row: number, col: number, event: MouseEvent): void {
    if (event.button !== 0) return; // Chỉ thực hiện nếu nhả chuột trái
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout); // Hủy bộ đếm thời gian nếu nhấn giữ chưa xảy ra
      this.applyType(row, col); // Thực hiện hành động nhấn
    }
    this.holdTimeout = null; // Đặt lại holdTimeout
  }

  // Di chuột ra khỏi ô
  onMouseLeave(event: MouseEvent): void {
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout); // Hủy bộ đếm thời gian nếu nhấn giữ chưa xảy ra
      this.holdTimeout = null; // Đặt lại holdTimeout
    }
  }

  // Nhấn chuột
  onClick(row: number, col: number, event: MouseEvent): void {
    if (event.button !== 0) return; // Chỉ thực hiện nếu nhấn chuột trái
    if (this.holdTimeout) {
      clearTimeout(this.holdTimeout); // Hủy bộ đếm thời gian nếu nhấn giữ chưa xảy ra
      this.holdTimeout = null; // Đặt lại holdTimeout
      this.applyType(row, col); // Thực hiện hành động nhấn
    }
  }

  getIconByType(type: number, status: string = 'available'): string {
    const selectedType = this.types.find((t) => t.value === type);
    if (type === 1 && status === 'block' && selectedType?.blockIcon) {
      return `assets/icons/${selectedType.blockIcon}`; // Đường dẫn đến icon đặc biệt
    }
    return selectedType?.icon ? `assets/icons/${selectedType.icon}` : '';
  }

  // Kiểm tra xem ô có đang ở chế độ chỉnh sửa
  isEditing(row: number, col: number): boolean {
    return this.matrix[row][col].isEditing;
  }

  // Bắt đầu chỉnh sửa ô khi nhấn chuột phải
  startEdit(row: number, col: number, event: MouseEvent): void {
    event.preventDefault(); // Ngăn chặn menu chuột phải mặc định
    const cell = this.matrix[row][col];
    if (cell.type > 0 && cell.type !== 2 && cell.type !== 3) {
      this.originalName = cell.name; // Lưu giá trị name hiện tại
      cell.isEditing = true; // Bắt đầu chế độ chỉnh sửa
      this.focusCell();
    }
  }

  saveEdit(row: number, col: number): void {
    const cell = this.matrix[row][col];
    const newName = cell.name;

    // Kiểm tra định dạng tên (phải bắt đầu bằng 'A' và theo sau là số từ 01 đến 99)
    const nameFormat = /^A\d{2}$/;
    if (!nameFormat.test(newName)) {
      toast.error('Tên không hợp lệ. Tên phải có định dạng A01, A02, ..., A99.');
      cell.hasError = true; // Đánh dấu ô có lỗi
      cell.isEditing = true; // Giữ ô ở chế độ chỉnh sửa
      this.focusCell(); // Focus vào ô lỗi
      return;
    }

    // Kiểm tra nếu tên mới đã được sử dụng và khác với tên hiện tại
    if (newName !== this.originalName && this.usedNames.has(parseInt(newName.slice(1)))) {
      toast.error('Tên này đã được sử dụng. Vui lòng chọn tên khác.');
      cell.hasError = true; // Đánh dấu ô có lỗi
      cell.isEditing = true; // Giữ ô ở chế độ chỉnh sửa
      this.focusCell(); // Focus vào ô lỗi
      return;
    }

    // Xóa tên cũ khỏi danh sách đã sử dụng
    this.usedNames.delete(parseInt(this.originalName.slice(1)));

    // Thêm tên mới vào danh sách đã sử dụng
    this.usedNames.add(parseInt(newName.slice(1)));

    cell.hasError = false; // Xóa đánh dấu lỗi
    cell.isEditing = false; // Kết thúc chế độ chỉnh sửa
  }

  saveSelected(): void {
    // Ánh xạ dữ liệu từ các ô được chọn trong ma trận 1 sang ma trận 2
    const selectedCells = this.matrix.flat().filter((cell) => cell.isSelected);

    selectedCells.forEach((cell) => {
      const row = Math.floor((cell.value - 1) / this.cols);
      const col = (cell.value - 1) % this.cols;

      // Kiểm tra và gán GUID nếu chưa có
      if (!cell.id) {
        cell.id = uuidv4();
      }

      this.selectedMatrix[row][col] = {
        id: cell.id,
        value: cell.value,
        type: cell.type,
        name: cell.name,
        status: cell.status,
      };
    });

    this.updateDisplayMatrix();
    console.log('Selected Cells:', selectedCells);
    toast.success('Dữ liệu đã được lưu thành công!');
  }


  resetSelected() {
    this.initializeMatrix();
    this.usedNames.clear();
  }

  // Phương thức thay đổi trạng thái của ô trong ma trận thứ hai
  toggleStatus(row: number, col: number, event: MouseEvent): void {
    event.preventDefault(); // Ngăn chặn menu chuột phải mặc định
    const cell = this.matrix[row][col];
    if (cell.type === 2 || cell.type === 3) {
      return; // Không cho phép click nếu type là 2 hoặc 3
    }

    // Remove the current status class
    const cellElement = this.el.nativeElement.querySelector(`#cell-${row}-${col}`);
    this.renderer.removeClass(cellElement, `status-${cell.status}`);

    setTimeout(() => {
      if (cell.status === 'available') {
        cell.status = 'block';
      } else if (cell.status === 'block') {
        cell.status = 'available';
      }

      // Add the new status class
      this.renderer.addClass(cellElement, `status-${cell.status}`);
    }, 300); // Ensure the revert animation completes before applying the new status
  }

  hasError(): boolean {
    return this.matrix.some((row) => row.some((cell) => cell.hasError));
  }

  displayRows: boolean[] = [];
  visibleColumns: boolean[] = [];
  selectedColumns: number[] = [];

  ngOnInit() {
    this.updateDisplayMatrix();
  }

  // Phương thức cập nhật displayRows và visibleColumns
  updateDisplayMatrix() {
    const rows = this.selectedMatrix.length;
    const cols = this.selectedMatrix[0].length;

    // Khởi tạo mảng trạng thái hiển thị
    this.displayRows = Array(rows).fill(false);
    this.visibleColumns = Array(cols).fill(false);
    this.selectedColumns = [];
    const selectedRows = new Set<number>(); // Tập hợp các hàng được chọn

    // Cập nhật trạng thái hiển thị dựa trên các ô được chọn
    this.selectedMatrix.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.type > 0) {
          this.displayRows[i] = true;
          this.selectedColumns.push(j);
          selectedRows.add(i); // Thêm hàng được chọn vào tập hợp
        }
      });
    });

    // Đảm bảo rằng tất cả các hàng giữa hàng đầu tiên và hàng cuối cùng đều được hiển thị
    const selectedRowsArray = Array.from(selectedRows).sort((a, b) => a - b);
    const firstSelectedRow = selectedRowsArray[0];
    const lastSelectedRow = selectedRowsArray[selectedRowsArray.length - 1];

    for (let i = firstSelectedRow; i <= lastSelectedRow; i++) {
      this.displayRows[i] = true;
    }

    // Sắp xếp các cột được chọn
    this.selectedColumns.sort((a, b) => a - b);

    // Hiển thị các cột từ cột đầu tiên được chọn đến cột cuối cùng được chọn
    if (this.selectedColumns.length > 0) {
      const firstCol = this.selectedColumns[0];
      const lastCol = this.selectedColumns[this.selectedColumns.length - 1];
      for (let j = firstCol; j <= lastCol; j++) {
        this.visibleColumns[j] = true;
      }
    }
  }
}

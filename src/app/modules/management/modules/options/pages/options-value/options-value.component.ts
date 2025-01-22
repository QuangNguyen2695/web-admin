import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { toast } from 'ngx-sonner';
import { User } from 'src/app/modules/management/model/user.model';

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
    value: number;
    type: number;
    isEditing: boolean;
    isSelected: boolean;
    name: string;
    icon: string;
    status: string;
    errorName: string;
    hasError: boolean;
  }[][] = []; // Ma trận lưu giá trị, kiểu, trạng thái chỉnh sửa, trạng thái chọn, tên
  currentType: number = 1; // Kiểu hiện tại đang chọn
  usedNames: Set<number> = new Set(); // Danh sách lưu trữ các giá trị đã được sử dụng
  selectedMatrix: {
    value: number;
    type: number;
    name: string;
    icon: string;
    status: string;
  }[][] = []; // Ma trận thứ hai lưu giá trị, kiểu, trạng thái chỉnh sửa, trạng thái chọn, tên và trạng thái của các ô được chọn
  originalName: string = '';
  holdTimeout: any;
  types = [
    { value: 1, label: 'Ghế', allowAutoNameEdit: true, icon: 'seat-available.svg', blockIcon: 'seat-block.svg' },
    { value: 2, label: 'Hành lang', allowAutoNameEdit: false, icon: 'street.svg' },
    { value: 3, label: 'Tài xế', allowAutoNameEdit: false, icon: 'driver.svg' },
  ];

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.initializeMatrix(); // Tạo ma trận 5x5

    ///temp second matrix
    this.selectedMatrix = Array.from({ length: this.rows }, (_, i) =>
      Array.from({ length: this.cols }, (_, j) => ({
        value: i * this.cols + j + 1,
        type: 0,
        name: '',
        icon: '',
        status: '',
      })),
    );
  }

  // Khởi tạo ma trận và trạng thái chọn
  initializeMatrix(): void {
    this.matrix = Array.from({ length: this.rows }, (_, i) =>
      Array.from({ length: this.cols }, (_, j) => ({
        value: i * this.cols + j + 1,
        type: 0,
        isEditing: false,
        isSelected: false,
        name: '',
        icon: '',
        errorName: '',
        status: 'available',
        hasError: false, // Thêm thuộc tính hasError
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
    // Thêm điều kiện kiểm tra nếu type của cell đã chọn giống với currentType thì không cho chọn nữa
    if (cell.type === this.currentType) {
      return;
    }

    if (cell.isEditing) {
      return;
    }

    // Kiểm tra và lưu trạng thái chỉnh sửa hiện tại
    this.matrix.forEach((matrixRow, i) => {
      matrixRow.forEach((cell, j) => {
        if (cell.isEditing) {
          this.saveEdit(i, j);
        }
      });
    });

    if (this.hasError()) {
      return; // Không cho phép chuyển nếu có lỗi
    }

    // Nếu ô đang là type 1 và được thay đổi thành type 2 hoặc 3, cập nhật lại usedNames
    if (cell.type === 1 && (this.currentType === 2 || this.currentType === 3)) {
      this.usedNames.delete(parseInt(cell.name.slice(1)));
    }

    this.matrix.forEach((matrixRow, i) => {
      matrixRow.forEach((cell, j) => {
        if (cell.isEditing) {
          this.saveEdit(i, j);
        }
      });
    });

    if (this.currentType > 0) {
      cell.type = this.currentType;
      cell.isSelected = true;

      // Xóa tên nếu type là 2 hoặc 3
      if (this.currentType === 2 || this.currentType === 3) {
        cell.name = '';
      } else if (selectedType?.allowAutoNameEdit) {
        const maxNames = this.rows * this.cols;
        for (let i = 1; i <= maxNames; i++) {
          if (!this.usedNames.has(i)) {
            cell.name = `A${i.toString().padStart(2, '0')}`;
            this.usedNames.add(i);
            break;
          }
        }
      }

      // Cập nhật icon bằng hàm getIconByType
      cell.icon = this.getIconByType(cell.type, cell.status);
    }
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

  // Phương thức lưu giá trị selected
  saveSelected(): void {
    // Ánh xạ dữ liệu từ các ô được chọn trong ma trận 1 sang ma trận 2
    const selectedCells = this.matrix.flat().filter((cell) => cell.isSelected);
    // Ánh xạ dữ liệu từ selectedCells sang selectedMatrix
    selectedCells.forEach((cell) => {
      const row = Math.floor((cell.value - 1) / this.cols);
      const col = (cell.value - 1) % this.cols;
      this.selectedMatrix[row][col] = {
        value: cell.value,
        type: cell.type,
        name: cell.name,
        status: cell.status,
        icon: this.getIconByType(cell.type, cell.status),
      };
    });

    console.log('Selected Cells:', this.selectedMatrix);
    toast.success('Dữ liệu đã được lưu thành công!');
  }

  // Phương thức thay đổi trạng thái của ô trong ma trận thứ hai
  toggleStatus(row: number, col: number, event: MouseEvent): void {
    event.preventDefault(); // Ngăn chặn menu chuột phải mặc định
    const cell = this.matrix[row][col];
    if (cell.type === 2 || cell.type === 3) {
      return; // Không cho phép click nếu type là 2 hoặc 3
    }
    if (cell.status === 'available') {
      cell.status = 'block';
    } else if (cell.status === 'block') {
      cell.status = 'available';
    }
  }

  hasError(): boolean {
    return this.matrix.some((row) => row.some((cell) => cell.hasError));
  }

  // Phương thức kiểm tra xem type có cho phép chỉnh sửa tên hay không
  isNameEditable(type: number): boolean {
    const selectedType = this.types.find((t) => t.value === type);
    return selectedType ? selectedType.allowAutoNameEdit : false;
  }

  ngOnInit() {}
}

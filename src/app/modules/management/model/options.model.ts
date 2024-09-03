export class SearchOptions {
  options: Options[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class Options {
  id: string = '';
  name: string = '';
  description: string = '';
  selected: boolean = false;
}

export class Options2Create {
  name: string = '';
  description: string = '';
}

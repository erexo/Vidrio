export class MenuItem {
  constructor(
    public tabName: string,
    public label: string,
    public iconName: string,
    public isLogout?: boolean
  ) {}
}
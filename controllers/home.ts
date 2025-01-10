import { HomeData } from "../data/home";


export class HomeController {
  constructor(private homeData: HomeData) {}
  async index() {
    return await this.homeData.index();
  }
}

export class CronosArea {
  id: string;
  name: string;
  address: string;
  capacity: number;
  location: string;
  type: string;
  public hasFreeSeats(date: string) {
    return true;
  }
}

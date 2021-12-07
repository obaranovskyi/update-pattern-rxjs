import { BehaviorSubject, OperatorFunction } from "rxjs";
import { map, scan } from "rxjs/operators";

export interface Car {
  id: number;
  make: string;
  color: string;
}

type PartialCar = Partial<Car>;

export function assign<T>(): OperatorFunction<Partial<T>, Partial<T>> {
  return scan((oldValue: Partial<T>, newValue: Partial<T>) => {
    return { ...oldValue, ...newValue };
  });
}

export class CarService {
  private carBhvSubj = new BehaviorSubject<PartialCar>({ color: "White" });
  car$ = this.carBhvSubj.asObservable().pipe(assign());

  isCarValid$ = this.car$.pipe(
    map((car: PartialCar) => {
      return Boolean(car.color && car.make);
    })
  );

  updateCar(carPart: PartialCar): void {
    this.carBhvSubj.next(carPart);
  }
}

const carService = new CarService();
carService.car$.subscribe(console.log);
carService.isCarValid$.subscribe(console.log);

carService.updateCar({ make: "BMV" });

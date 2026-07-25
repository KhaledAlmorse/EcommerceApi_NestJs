export enum RolesEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export enum OtpTypeEnum {
  CONFIRMATION = 'confirmation',
  RESET_PASSWORD = 'reset-password',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
}

export enum OrderStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  PLACED = 'placed',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
  ON_WAY = 'on-way',
}

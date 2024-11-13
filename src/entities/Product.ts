import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { CampaignProduct } from "./CampaignProduct";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  codebar!: string;

  @Column()
  name!: string;

  @Column("decimal")
  weight_value!: number;

  @Column()
  weight_type!: string;

  @OneToMany(
    () => CampaignProduct,
    (campaignProduct) => campaignProduct.product
  )
  campaignProducts!: CampaignProduct[];

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}

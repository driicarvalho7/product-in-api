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
export class Campaign {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @OneToMany(
    () => CampaignProduct,
    (campaignProduct) => campaignProduct.campaign
  )
  campaignProducts!: CampaignProduct[];

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}

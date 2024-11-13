import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Campaign } from "./Campaign";
import { Product } from "./Product";

@Entity()
export class CampaignProduct {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.campaignProducts, {
    onDelete: "CASCADE",
  })
  campaign!: Campaign;

  @ManyToOne(() => Product, (product) => product.campaignProducts, {
    onDelete: "CASCADE",
  })
  product!: Product;

  @Column("int")
  quantity!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: string;


    @Column('text', {
        unique: true,
    })
    title: string;

    @Column('float', {
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description?: string;


    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User
}
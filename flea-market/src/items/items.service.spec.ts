import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { ItemRepository } from './item.repository';
import { UserStatus } from '../auth/user-status.enum';
import { ItemStatus } from './item-status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockItemRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    createItem: jest.fn(),
    save: jest.fn(),
    delete: jest.fn()
});

const mockUser1 = {
    id: '1',
    username: 'test1',
    password: '1234',
    status: UserStatus.PREMIUM
};
const mockUser2 = {
    id: '2',
    username: 'test2',
    password: '1234',
    status: UserStatus.FREE
};

describe('ItemServiceTest', () => {
    let itemsService;
    let itemsRepository;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [ItemsService, {
                provide: ItemRepository,
                useFactory: mockItemRepository
            }]
        }).compile();
        itemsService = module.get<ItemsService>(ItemsService);
        itemsRepository = module.get<ItemRepository>(ItemRepository);
    })

    describe('findAll', () => {
        it('正常系', async () => {
            const expected = [];
            itemsRepository.find.mockResolvedValue(expected);
            const result = await itemsService.findAll();
            expect(result).toEqual(expected);
        });
    })

    describe('findById', () => {
        it('正常系', async () => {
            const expected = {
                id: 'test-id',
                name: 'PC',
                price: 50000,
                description: '',
                status: ItemStatus.ON_SALE,
                createdAt: '',
                updatedAt: '',
                user: mockUser1
            }

            itemsRepository.findOne.mockResolvedValue(expected);
            const result = await itemsService.findById('test-id');
            expect(result).toEqual(expected);
        });

        it('異常系: 商品が存在しない', async () => {
            itemsRepository.findOne.mockResolvedValue(null);
            await expect(itemsService.findById('test-id')).rejects.toThrow(NotFoundException);
        });
    })

    describe('create', () => {
        it('正常系', async () => {
            const expected = {
                id: 'test-id',
                name: 'PC',
                price: 50000,
                description: '',
                status: ItemStatus.ON_SALE,
                createdAt: '',
                updatedAt: '',
                user: mockUser1
            };
            itemsRepository.createItem.mockResolvedValue(expected);
            const result = await itemsService.create({ name: 'PC', price: 50000, describe: '' }, mockUser1);
            expect(result).toEqual(expected);
        })
    })

    describe('updateStatus', () => {
        const mockItem = {
            id: 'test-id',
            name: 'PC',
            price: 50000,
            description: '',
            status: ItemStatus.ON_SALE,
            createdAt: '',
            updatedAt: '',
            userId: mockUser1.id,
            user: mockUser1
        };
        it('正常系', async () => {
            itemsRepository.findOne.mockResolvedValue(mockItem);
            await itemsService.updateStatus('test-id', mockUser2);
            expect(itemsRepository.save).toHaveBeenCalled();
        });
        it('異常系: 自身の商品を購入', async () => {
            itemsRepository.findOne.mockResolvedValue(mockItem);
            await expect(itemsService.updateStatus('test-id', mockUser1)).rejects.toThrow(BadRequestException);
        })
    });

    describe('delete', () => {
        const mockItem = {
            id: 'test-id',
            name: 'PC',
            price: 50000,
            description: '',
            status: ItemStatus.ON_SALE,
            createdAt: '',
            updatedAt: '',
            userId: mockUser1.id,
            user: mockUser1
        };
        it('正常系', async () => {
            itemsRepository.findOne.mockResolvedValue(mockItem);
            await itemsService.delete('test-id', mockUser1);
            expect(itemsRepository.delete).toHaveBeenCalled();
        });
        it('異常系: 他人の商品を削除', async () => {
            itemsRepository.findOne.mockResolvedValue(mockItem);
            await expect(itemsService.delete('test-id', mockUser2)).rejects.toThrow(BadRequestException);
        })
    });
})
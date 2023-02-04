import { Effect as PrismaEffect, Prisma, PrismaClient } from '@prisma/client'
import { Effect, EffectCategory, EffectTag, EffectType } from 'osiris'

export class EffectMapper {
	toDomain(effect: PrismaEffect, effects?: Effect[]): Effect {
		return new Effect({
			...effect,
			category: effect.category as EffectCategory,
			type: effect.type as EffectType,
			tags: effect.tags as EffectTag[],
			parameters: undefined,
			see_also: effects
		})
	}

	toDatabase(effect: Effect): Prisma.EffectCreateInput {
		const object = effect.toJSON()

		return {
			...object,
			slug: effect.slug,
			type: object.type as unknown as string,
			category: object.category as unknown as string,
			tags: object.tags as unknown as string[],
			see_also: object.see_also?.map(effect => effect.slug) ?? [],
			parameters: undefined
		}
	}
}

export class EffectRepository {
	private mapper: EffectMapper = new EffectMapper()
	constructor(private prisma: PrismaClient) {}

	async findOneBySlug(slug: string): Promise<Effect | null> {
		const effect = await this.prisma.effect.findUnique({
			where: {
				slug
			}
		})

		let relatedEffects: PrismaEffect[] = []

		if (effect?.see_also) {
			relatedEffects = await this.prisma.effect.findMany({
				where: {
					slug: {
						in: effect?.see_also
					}
				}
			})
		}

		let see_also: Effect[] = []

		if (relatedEffects) {
			see_also = relatedEffects.map(effect => this.mapper.toDomain({ ...effect }))
		}

		if (!effect) {
			return null
		}

		return this.mapper.toDomain({ ...effect }, see_also)
	}

	async save(effect: Effect): Promise<Effect> {
		const slug = effect.slug
		const isEffectExisting = await this.findOneBySlug(slug)

		if (isEffectExisting) {
			// Update
			const updatedEffect = await this.prisma.effect.update({
				where: { slug: slug },
				data: this.mapper.toDatabase(effect)
			})

			return this.mapper.toDomain(updatedEffect)
		} else {
			// Create
			const createdEffect = await this.prisma.effect.create({
				data: this.mapper.toDatabase(effect)
			})

			return this.mapper.toDomain(createdEffect)
		}
	}
}

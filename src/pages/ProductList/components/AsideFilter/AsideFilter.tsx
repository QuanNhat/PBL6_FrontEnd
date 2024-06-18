import classNames from 'classnames'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import path from 'src/constants/path'
import { Category } from 'src/types/category.type'
import { useForm, Controller } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from 'src/types/utils.type'
import omit from 'lodash/omit'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'
import { ObjectSchema } from 'yup'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>

const priceSchema = schema.pick(['price_min', 'price_max'])

export default function AsideFilter({ queryConfig, categories }: Props) {
  const { t } = useTranslation('home')
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver<FormData>(priceSchema as ObjectSchema<FormData>)
  })
  const navigate = useNavigate()
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    reset()
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }

  return (
    <div className='flex items-stretch gap-4 py-4 w-full'>
      <div className='flex flex-col w-full'>
        <Link
          to={path.home}
          className={classNames('flex items-center font-bold', {
            'text-teal-700': !category
          })}
        >
          <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
            <g fillRule='evenodd' stroke='none' strokeWidth={1}>
              <g transform='translate(-373 -208)'>
                <g transform='translate(155 191)'>
                  <g transform='translate(218 17)'>
                    <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                    <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                    <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  </g>
                </g>
              </g>
            </g>
          </svg>
          {t('aside filter.all categories')}
        </Link>
        <div className='my-4 h-[1px] bg-gray-300' />
        <ul className='flex flex-wrap gap-2'>
          {categories.map((categoryItem) => {
            const isActive = category === categoryItem._id
            return (
              <li className='py-2 pl-2' key={categoryItem._id}>
                <Link
                  to={{
                    pathname: path.home,
                    search: createSearchParams({
                      ...queryConfig,
                      category: categoryItem._id
                    }).toString()
                  }}
                  className={classNames('relative px-2', {
                    'font-semibold text-teal-800': isActive
                  })}
                >
                  {isActive && (
                    <svg viewBox='0 0 4 7' className='absolute top-1 left-[-10px] h-2 w-2 fill-teal-800'>
                      <polygon points='4 3.5 0 0 0 7' />
                    </svg>
                  )}
                  {categoryItem.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      <div className='flex flex-col w-full'>
        <div className='flex flex-col'>
          <div className='font-semibold'>Khoảng giá</div>
          <div className='my-4 h-[1px] bg-gray-300' />
        </div>
        <form className='mt-2 flex items-center gap-2' onSubmit={onSubmit}>
          <Controller
            control={control}
            name='price_min'
            render={({ field }) => {
              return (
                <InputNumber
                  type='text'
                  className='w-28 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  placeholder='₫ TỪ'
                  classNameError='hidden'
                  {...field}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_max')
                  }}
                />
              )
            }}
          />
          <div className='mx-2'>-</div>
          <Controller
            control={control}
            name='price_max'
            render={({ field }) => {
              return (
                <InputNumber
                  type='text'
                  className='w-28 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  placeholder='₫ ĐẾN'
                  classNameError='hidden'
                  {...field}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_min')
                  }}
                />
              )
            }}
          />
          <div className='pr-4'></div>
          <Button className='bg-teal-400 px-6 text-sm uppercase text-white hover:bg-teal-400/50 h-11'>Áp dụng</Button>
        </form>
        <div className='mt-1 min-h-[1.25rem] text-center text-sm text-teal-600'>{errors.price_min?.message}</div>
      </div>
      <div className='flex flex-col w-full'>
        <div className='flex flex-col'>
          <div className='font-semibold'>Đánh giá</div>
          <div className='my-4 h-[1px] bg-gray-300' />
        </div>
        <div className='mt-2 flex items-center gap-2'>
          <div className='px-6'>
            <select
              className='w-28 h-12 px-2 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              onChange={(e) => {
                navigate({
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    rating_filter: e.target.value
                  }).toString()
                })
              }}
            >
              <option value=''>Đánh giá</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Sao
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleRemoveAll}
            className='w-32 h-11 bg-teal-400 px-4 text-sm uppercase text-white hover:bg-teal-400/50'
          >
            Xoá tất cả
          </Button>
        </div>
      </div>
    </div>
  )
}

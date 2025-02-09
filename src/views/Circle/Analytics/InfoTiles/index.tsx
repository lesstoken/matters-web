import classNames from 'classnames'

import { TextIcon, withIcon } from '~/components'

import { numRound } from '~/common/utils'

import { ReactComponent as IconAnalyticsChangeArrow12 } from '@/public/static/icons/12px/analytics-change-arrow.svg'

import styles from './styles.css'

type InfoTilesGroupProps = {
  primary?: boolean
}

type InfoTilesTileProps = {
  title: React.ReactNode
  value: string | React.ReactNode
  unit?: string | React.ReactNode
  indicatorColor?: string
  percentageChange?: number
}

const InfoTilesGroup: React.FC<
  React.PropsWithChildren<InfoTilesGroupProps>
> = ({ primary, children }) => {
  const groupClasses = classNames({
    group: true,
    primary: !!primary,
  })

  return (
    <section className={groupClasses}>
      {children}
      <style jsx>{styles}</style>
    </section>
  )
}

const InfoTilesTile: React.FC<InfoTilesTileProps> = ({
  title,
  value,
  unit,
  indicatorColor,
  percentageChange,
}) => {
  const changeClasses = classNames({
    change: true,
    positive: percentageChange && percentageChange > 0,
    negative: percentageChange && percentageChange < 0,
  })

  const change = Math.abs(percentageChange || 0)

  return (
    <section className="tile">
      <h3 className="title">
        {indicatorColor && (
          <span className="indicator" style={{ color: indicatorColor }} />
        )}
        {title}
      </h3>

      <div className="content">
        <span className="value">{value}</span>

        {unit && <span className="unit">{unit}</span>}

        {change ? (
          <span className={changeClasses}>
            <TextIcon
              icon={withIcon(IconAnalyticsChangeArrow12)({ size: 'xs' })}
              size="xs"
              spacing="xxxtight"
            >
              {numRound(change)}%
            </TextIcon>
          </span>
        ) : null}
      </div>

      <style jsx>{styles}</style>
    </section>
  )
}

const InfoTiles: React.FC<React.PropsWithChildren<React.ReactNode>> & {
  Group: typeof InfoTilesGroup
  Tile: typeof InfoTilesTile
} = ({ children }) => {
  return (
    <section className="container">
      {children}
      <style jsx>{styles}</style>
    </section>
  )
}

InfoTiles.Group = InfoTilesGroup
InfoTiles.Tile = InfoTilesTile

export default InfoTiles

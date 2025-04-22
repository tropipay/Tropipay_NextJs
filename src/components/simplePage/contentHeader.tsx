import React from "react"

interface ContentHeaderProps {
  title?: string | null
  subtitle?: string | null
  classNameTitle?: string
  styleTitle?: React.CSSProperties
  classNameSubtitle?: string
  styleSubtitle?: React.CSSProperties
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
  title = null,
  subtitle = null,
  classNameTitle = "text-xl text-center",
  styleTitle,
  classNameSubtitle = "",
  styleSubtitle,
}) => {
  return (
    <div className="mb-2 mt-2">
      {title && (
        <h1 className={classNameTitle} style={styleTitle}>
          {title}
        </h1>
      )}
      {subtitle ? (
        <p
          className={`${classNameSubtitle} text-center`}
          style={styleSubtitle}
          dangerouslySetInnerHTML={{
            __html: subtitle,
          }}
        ></p>
      ) : null}
    </div>
  )
}

export default ContentHeader

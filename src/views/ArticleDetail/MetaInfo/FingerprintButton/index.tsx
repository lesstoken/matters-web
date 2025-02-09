import {
  Button,
  FingerprintDialog,
  IconIPFS24,
  TextIcon,
  Translate,
} from '~/components'

import { FingerprintArticle } from '~/components/Dialogs/FingerprintDialog/__generated__/FingerprintArticle'

interface FingerprintButtonProps {
  article: FingerprintArticle
}

const FingerprintButton = ({ article }: FingerprintButtonProps) => {
  return (
    <FingerprintDialog article={article}>
      {({ openDialog }) => (
        <Button
          onClick={openDialog}
          spacing={['xxtight', 'xtight']}
          bgColor="green-lighter"
        >
          <TextIcon
            icon={<IconIPFS24 color="green" />}
            size="xs"
            spacing="xxtight"
            color="green"
          >
            <Translate id="IPFSEntrance" />
          </TextIcon>
        </Button>
      )}
    </FingerprintDialog>
  )
}

FingerprintButton.fragments = FingerprintDialog.fragments

export default FingerprintButton

(impl-trait .sip009-nft-trait.sip009-nft-trait)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

(define-data-var token-uri (string-ascii 246) "http://dunnicliffe.com")

(define-non-fungible-token acat uint)

(define-data-var last-token-id uint u0)

(define-read-only (get-last-token-id)
    (ok (var-get last-token-id))
)

;; SIP-09: URI for metadata associated with the token
(define-read-only (get-token-uri (id uint))
    (ok (some (var-get token-uri)))
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? acat token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        (nft-transfer? acat token-id sender recipient)
    )
)

(define-public (mint (recipient principal))
    (let
        (
            (token-id (+ (var-get last-token-id) u1))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (try! (nft-mint? acat token-id recipient))
        (var-set last-token-id token-id)
        (ok token-id)
    )
)

(define-public (set-token-uri (new-token-uri (string-ascii 246)))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        ;;(asserts! (not (var-get metadata-frozen)) ERR-METADATA-FROZEN)
        (var-set token-uri new-token-uri)
        (ok true))
)

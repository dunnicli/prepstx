
;; maps - This works!!
;; Testing maps

;; constants
;;

;; data maps and vars
(define-map metaUri int (string-ascii 255))
;;(define-map messages principal (string-utf8 500))


;; private functions
;;
(define-read-only (get-metaUri (token-id int))
    (map-get? metaUri token-id)
)


;; public functions
;;

(define-public (write-meta (token-id int) (uri (string-ascii 255)))
    (begin
        (map-insert metaUri token-id uri)

       (ok "URI written successfully")
    )
)



;;(define-map names-map { name: (string-ascii 10) } { id: int })
;;(map-insert names-map { name: "blockstack" } { id: 1337 }) ;; Returns true
;;(map-delete names-map { name: "blockstack" }) ;; Returns true
;;(map-delete names-map { name: "blockstack" }) ;; Returns false
;;(map-delete names-map (tuple (name "blockstack"))) ;; Same command, using a shorthand for constructing the tuple
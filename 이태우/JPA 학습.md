# JPA 학습 보고서

---

## 1. JPA란 무엇인가?
### 개념
- **JPA**(Java Persistence API)는 자바의 ORM(Object-Relational Mapping) 기술 표준으로, 객체와 데이터베이스 간의 매핑을 자동으로 처리하는 프레임워크입니다.
- SQL 작성 없이도 자바 객체를 활용하여 데이터를 저장, 조회, 수정, 삭제할 수 있습니다.

---

## 2. JPA가 필요한 이유
### 데이터베이스 관리의 복잡성 해결
1. **생산성 향상**:
   - 복잡한 SQL 대신 자바 객체와 메서드를 통해 데이터를 다룹니다.
2. **유지보수성 개선**:
   - 데이터베이스 구조 변경 시, SQL 대신 엔티티 클래스를 수정하여 대응합니다.
3. **객체지향 설계 강화**:
   - 데이터베이스 설계보다 비즈니스 로직에 집중할 수 있습니다.

---

## 3. JPA와 관련된 코드 분석

```java
@Controller
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping("/items/new")
    public String create(BookForm form) {
        // JPA 엔티티(Book)에 데이터 매핑
        Book book = new Book();
        book.setName(form.getName());
        book.setPrice(form.getPrice());
        book.setStockQuantity(form.getStockQuantity());
        book.setAuthor(form.getAuthor());
        book.setIsbn(form.getIsbn());

        itemService.saveItem(book); // JPA를 통해 영속성 컨텍스트에 저장
        return "redirect:/";
    }

    @GetMapping("/items")
    public String list(Model model) {
        // JPA로 상품 리스트 조회
        List<Item> items = itemService.findItems();
        model.addAttribute("items", items);
        return "items/itemList";
    }
}

@Controller
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/members/new")
    public String create(@Valid MemberForm form, BindingResult result) {
        if (result.hasErrors()) {
            return "members/createMemberForm";
        }

        // JPA 엔티티(Member)에 데이터 매핑
        Address address = new Address(form.getCity(), form.getStreet(), form.getZipcode());
        Member member = new Member();
        member.setName(form.getName());
        member.setAddress(address);

        memberService.join(member); // JPA를 통해 데이터 저장
        return "redirect:/";
    }

    @GetMapping("/members")
    public String list(Model model) {
        // JPA로 회원 리스트 조회
        List<Member> members = memberService.findMembers();
        model.addAttribute("members", members);
        return "members/memberList";
    }
}

@Controller
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final MemberService memberService;
    private final ItemService itemService;

    @PostMapping("/order")
    public String order(@RequestParam("memberId") Long memberId,
                        @RequestParam("itemId") Long itemId,
                        @RequestParam("count") int count) {
        // JPA를 사용해 주문 데이터 생성
        orderService.order(memberId, itemId, count);
        return "redirect:/orders";
    }

    @GetMapping("/orders")
    public String orderList(@ModelAttribute("orderSearch") OrderSearch orderSearch, Model model) {
        // JPA로 주문 리스트 조회
        List<Order> orders = orderService.findOrders(orderSearch);
        model.addAttribute("orders", orders);
        return "order/orderList";
    }

    @PostMapping("/orders/{orderId}/cancel")
    public String cancelOrder(@PathVariable("orderId") Long orderId) {
        // JPA로 주문 취소 처리
        orderService.cancelOrder(orderId);
        return "redirect:/orders";
    }
}

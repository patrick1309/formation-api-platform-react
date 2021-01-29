<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\CustomerRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * @ApiResource(
 *  subresourceOperations={
 *      "invoices_get_subresource"={"path"="/customers/{id}/invoices"}
 *  },
 *  normalizationContext={
 *      "groups"={"customers_read"}
 *  }
 * )
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(OrderFilter::class)
 * 
 */
class Customer
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"customers_read", "invoices_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\NotBlank(message="Le prénom est obligatoire")
     * @Assert\Length(min=3, minMessage="Le prénom doit faire entre 3 et 255 caractères", max=255, maxMessage="Le prénom doit faire entre 3 et 255 caractères")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\NotBlank(message="Le nom est obligatoire")
     * @Assert\Length(min=3, minMessage="Le nom doit faire entre 3 et 255 caractères", max=255, maxMessage="Le nom doit faire entre 3 et 255 caractères")
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\NotBlank(message="L'adresse email est obligatoire")
     * @Assert\Email(message="Le format de l'adresse email est invalide")
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"customers_read", "invoices_read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer")
     * @Groups({"customers_read"})
     * @ApiSubresource
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     * @Groups({"customers_read"})
     * @Assert\NotBlank(message="L'utilisateur est obligatoire")
     */
    private $user;

    /** 
     * @var MediaObject|null
     * 
     * @ORM\ManyToOne(targetEntity=MediaObject::class)
     * @Groups({"customers_read"})
     * @ORM\JoinColumn(nullable=true)
     * @ApiProperty(iri="http://schema.org/image")
     */
    private $picture;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    /**
     * Permet de récupérer le total des invoices
     * @Groups({"customers_read"})
     * @return float
     */
    public function getTotalAmount(): float
    {
        return array_reduce($this->getInvoices()->toArray(), function ($total, $invoice) {
            return $total + $invoice->getAmount();
        }, 0);
    }

    /**
     * Permet de récupérer le total des factures dues
     * @Groups({"customers_read"})
     * @return float
     */
    public function getUnpaidAmount(): float
    {
        return  array_reduce($this->getInvoices()->toArray(), function ($total, $invoice) {
            return $total + ($invoice->getStatus() === 'PAID' || $invoice->getStatus() === 'CANCELLED' ? 0 : $invoice->getAmount());
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->contains($invoice)) {
            $this->invoices->removeElement($invoice);
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getPicture(): ?MediaObject
    {
        return $this->picture;
    }

    public function setPicture(?MediaObject $picture): self
    {
        $this->picture = $picture;

        return $this;
    }
}
